import React, { useEffect, useMemo, useState } from "react";
import API from "../api"; // axios instance -> baseURL: http://localhost:1337/api
import "../styles/admin-panel.css";

const MEDIA_URL = "http://localhost:1337"; // za prikaz slika

export default function AdminPanel() {
  const token = localStorage.getItem("token") || "";
  const isAuthed = !!token;

  // ---------- GLOBAL UI ----------
  const [tab, setTab] = useState("recepti"); // "recepti" | "putovanja"
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("-Datum"); // Strapi sort: -Datum (desc), Datum (asc)
  const [toast, setToast] = useState({ type: "", msg: "" });
  const [busy, setBusy] = useState(false);

  // ---------- DATA ----------
  const [recepti, setRecepti] = useState([]);
  const [putovanja, setPutovanja] = useState([]);

  // ---------- MODALS ----------
  const [modalOpen, setModalOpen] = useState(false);
  const [entityType, setEntityType] = useState("recept"); // "recept" | "putovanje"
  const [editingId, setEditingId] = useState(null);

  // ---------- FORMS ----------
  const emptyRecept = {
    Naslov: "",
    KratkiOpis: "",
    Opis: "",
    Sastojci: "",
    Priprema: "",
    Okus: "slatko",
    Istaknuto: false,
    Datum: new Date().toISOString().slice(0, 10),
    Autor: "admin",
    // Kategorija: null, // ako trebaš relaciju
  };
  const emptyPutovanje = {
    Naslov: "",
    Slug: "",
    Lokacija: "",
    Opis: "",
    Istaknuto: false,
    Datum: new Date().toISOString().slice(0, 10),
  };

  const [form, setForm] = useState(emptyRecept);
  const [file, setFile] = useState(null); // single hero slika
  const [gallery, setGallery] = useState([]); // multiple za putovanja (Fotografija)

  // ---------- HELPERS ----------
  const headersAuth = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: "", msg: "" }), 2500);
  }

  function mediaThumb(m) {
    if (!m) return "";
    const url = m.url || (Array.isArray(m) ? m[0]?.url : "");
    if (!url) return "";
    return url.startsWith("http") ? url : `${MEDIA_URL}${url}`;
  }

  // ---------- LOAD ----------
  async function loadRecepti() {
    try {
      const res = await API.get(
        `/recepts?populate=*&sort=${sort}&filters[Naslov][$containsi]=${encodeURIComponent(
          query
        )}`,
        headersAuth
      );
      const arr = Array.isArray(res.data?.data) ? res.data.data : [];
      setRecepti(
        arr.map((x) => ({
          id: x.id,
          ...(x.attributes || x),
          thumb: mediaThumb((x.attributes || x).Slika),
        }))
      );
    } catch (e) {
      console.error(e);
      showToast("error", "Greška kod učitavanja recepata");
    }
  }

  async function loadPutovanja() {
    try {
      const res = await API.get(
        `/putovanjas?populate=*&sort=${sort}&filters[Naslov][$containsi]=${encodeURIComponent(
          query
        )}`,
        headersAuth
      );
      const arr = Array.isArray(res.data?.data) ? res.data.data : [];
      setPutovanja(
        arr.map((x) => ({
          id: x.id,
          ...(x.attributes || x),
          thumb: mediaThumb((x.attributes || x).Fotografija),
        }))
      );
    } catch (e) {
      console.error(e);
      showToast("error", "Greška kod učitavanja putovanja");
    }
  }

  useEffect(() => {
    if (!isAuthed) return;
    if (tab === "recepti") loadRecepti();
    if (tab === "putovanja") loadPutovanja();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, tab, sort]);

  // pretraga “debounce mini”
  useEffect(() => {
    if (!isAuthed) return;
    const t = setTimeout(() => {
      if (tab === "recepti") loadRecepti();
      if (tab === "putovanja") loadPutovanja();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // ---------- ACTIONS ----------
  function openCreate(type) {
    setEntityType(type);
    setEditingId(null);
    setForm(type === "recept" ? { ...emptyRecept } : { ...emptyPutovanje });
    setFile(null);
    setGallery([]);
    setModalOpen(true);
  }

  function openEdit(type, item) {
    setEntityType(type);
    setEditingId(item.id);
    if (type === "recept") {
      setForm({
        Naslov: item.Naslov || "",
        KratkiOpis: item.KratkiOpis || "",
        Opis: item.Opis || "",
        Sastojci: item.Sastojci || "",
        Priprema: item.Priprema || "",
        Okus: item.Okus || "slatko",
        Istaknuto: !!item.Istaknuto,
        Datum: (item.Datum || "").slice(0, 10),
        Autor: item.Autor || "admin",
      });
    } else {
      setForm({
        Naslov: item.Naslov || "",
        Slug: item.Slug || "",
        Lokacija: item.Lokacija || "",
        Opis: item.Opis || "",
        Istaknuto: !!item.Istaknuto,
        Datum: (item.Datum || "").slice(0, 10),
      });
    }
    setFile(null);
    setGallery([]);
    setModalOpen(true);
  }

  async function uploadFiles(files) {
    if (!files || files.length === 0) return [];
    const fd = new FormData();
    for (const f of files) fd.append("files", f);
    const res = await fetch(`${MEDIA_URL}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error("Upload nije prošao");
    const json = await res.json();
    return json.map((m) => m.id);
  }

  async function handleSave(e) {
    e?.preventDefault?.();
    setBusy(true);
    try {
      // 1) upload
      let mediaIds = [];
      if (entityType === "recept" && file) {
        mediaIds = await uploadFiles([file]);
      }
      if (entityType === "putovanje" && gallery.length) {
        mediaIds = await uploadFiles(gallery);
      }

      // 2) payload
      const data = { ...form };

      if (entityType === "recept") {
        if (mediaIds.length) data.Slika = mediaIds; // multiple
      } else {
        if (mediaIds.length) data.Fotografija = mediaIds; // multiple
      }

      // 3) create / update
      if (editingId) {
        const endpoint =
          entityType === "recept"
            ? `/recepts/${editingId}`
            : `/putovanjas/${editingId}`;
        await API.put(endpoint, { data }, headersAuth);
        showToast("ok", "Spremljene promjene");
      } else {
        const endpoint = entityType === "recept" ? `/recepts` : `/putovanjas`;
        await API.post(endpoint, { data }, headersAuth);
        showToast("ok", "Dodano!");
      }

      setModalOpen(false);
      if (entityType === "recept") loadRecepti();
      else loadPutovanja();
    } catch (e) {
      console.error(e);
      showToast(
        "error",
        e?.response?.data?.error?.message || "Greška pri spremanju"
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(type, id) {
    if (!window.confirm("Sigurno obrisati?")) return;
    try {
      const endpoint =
        type === "recept" ? `/recepts/${id}` : `/putovanjas/${id}`;
      await API.delete(endpoint, headersAuth);
      showToast("ok", "Obrisano");
      if (type === "recept") loadRecepti();
      else loadPutovanja();
    } catch (e) {
      console.error(e);
      showToast("error", "Greška pri brisanju");
    }
  }

  async function toggleIstaknuto(type, item) {
    try {
      const endpoint =
        type === "recept" ? `/recepts/${item.id}` : `/putovanjas/${item.id}`;
      await API.put(
        endpoint,
        { data: { Istaknuto: !item.Istaknuto } },
        headersAuth
      );
      if (type === "recept") loadRecepti();
      else loadPutovanja();
    } catch (e) {
      console.error(e);
      showToast("error", "Greška pri izmjeni");
    }
  }

  if (!isAuthed) {
    return (
      <div className="ap-wrap">
        <div className="ap-card">
          <h1>🔒 Admin zona</h1>
          <p>Za pristup panelu prijavi se.</p>
          <a className="ap-btn" href="/prijava">
            Idi na prijavu
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-wrap">
      {toast.msg && (
        <div className={`ap-toast ${toast.type === "error" ? "err" : "ok"}`}>
          {toast.msg}
        </div>
      )}

      {/* Top bar */}
      <div className="ap-toolbar ap-card">
        <div className="ap-tabs">
          <button
            className={tab === "recepti" ? "active" : ""}
            onClick={() => setTab("recepti")}
          >
            🍰 Recepti
          </button>
          <button
            className={tab === "putovanja" ? "active" : ""}
            onClick={() => setTab("putovanja")}
          >
            ✈ Putovanja
          </button>
        </div>

        <div className="ap-flex-gap">
          <input
            className="ap-input"
            placeholder="Pretraži naslov…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="ap-input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="-Datum">Najnovije</option>
            <option value="Datum">Najstarije</option>
          </select>

          <button
            className="ap-btn"
            onClick={() =>
              openCreate(tab === "recepti" ? "recept" : "putovanje")
            }
          >
            ➕ {tab === "recepti" ? "Novi recept" : "Novo putovanje"}
          </button>

          <button
            className="ap-btn ghost"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/prijava";
            }}
          >
            Odjava
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="ap-grid">
        {(tab === "recepti" ? recepti : putovanja).map((it) => (
          <div className="ap-card ap-item" key={it.id}>
            <div className="thumb">
              {it.thumb ? (
                <img src={it.thumb} alt={it.Naslov} />
              ) : (
                <span>IMG</span>
              )}
            </div>
            <div className="meta">
              <h3>{it.Naslov}</h3>
              <p className="muted">
                {tab === "recepti"
                  ? (it.Okus || "").toUpperCase()
                  : it.Lokacija || "—"}
                {" · "}
                {it.Istaknuto ? "ISTAKNUTO" : "—"}
              </p>
            </div>
            <div className="actions">
              <button
                className="ap-btn small"
                onClick={() =>
                  toggleIstaknuto(
                    tab === "recepti" ? "recept" : "putovanje",
                    it
                  )
                }
              >
                {it.Istaknuto ? "Makni istaknuto" : "Istakni"}
              </button>
              <button
                className="ap-btn small ghost"
                onClick={() =>
                  openEdit(tab === "recepti" ? "recept" : "putovanje", it)
                }
              >
                Uredi
              </button>
              <button
                className="ap-btn small danger"
                onClick={() =>
                  handleDelete(
                    tab === "recepti" ? "recept" : "putovanje",
                    it.id
                  )
                }
              >
                Obriši
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="ap-modal">
          <div className="ap-modal-body ap-card">
            <div className="ap-modal-head">
              <h2>
                {editingId ? "Uredi" : "Dodaj"}{" "}
                {entityType === "recept" ? "recept" : "putovanje"}
              </h2>
              <button className="ap-x" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>

            <form className="ap-form" onSubmit={handleSave}>
              <div className="ap-grid-2">
                <label>
                  Naslov
                  <input
                    className="ap-input"
                    value={form.Naslov}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, Naslov: e.target.value }))
                    }
                    required
                  />
                </label>

                {entityType === "putovanje" && (
                  <label>
                    Slug
                    <input
                      className="ap-input"
                      value={form.Slug || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, Slug: e.target.value }))
                      }
                      placeholder="unikatni-slug"
                    />
                  </label>
                )}

                {entityType === "recept" && (
                  <>
                    <label>
                      Autor
                      <input
                        className="ap-input"
                        value={form.Autor}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, Autor: e.target.value }))
                        }
                      />
                    </label>

                    <label>
                      Okus
                      <select
                        className="ap-input"
                        value={form.Okus}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, Okus: e.target.value }))
                        }
                      >
                        <option value="slatko">Slatko</option>
                        <option value="slano">Slano</option>
                      </select>
                    </label>
                  </>
                )}

                {entityType === "putovanje" && (
                  <label className="full">
                    Lokacija
                    <input
                      className="ap-input"
                      value={form.Lokacija || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, Lokacija: e.target.value }))
                      }
                    />
                  </label>
                )}

                <label>
                  Datum
                  <input
                    className="ap-input"
                    type="date"
                    value={form.Datum}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, Datum: e.target.value }))
                    }
                  />
                </label>

                <label className="ap-check">
                  <input
                    type="checkbox"
                    checked={!!form.Istaknuto}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, Istaknuto: e.target.checked }))
                    }
                  />
                  Istaknuto
                </label>

                {entityType === "recept" && (
                  <>
                    <label className="full">
                      Kratki opis
                      <input
                        className="ap-input"
                        value={form.KratkiOpis}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, KratkiOpis: e.target.value }))
                        }
                      />
                    </label>

                    <label className="full">
                      Sastojci
                      <textarea
                        className="ap-input"
                        rows={4}
                        value={form.Sastojci}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, Sastojci: e.target.value }))
                        }
                      />
                    </label>

                    <label className="full">
                      Priprema
                      <textarea
                        className="ap-input"
                        rows={5}
                        value={form.Priprema}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, Priprema: e.target.value }))
                        }
                      />
                    </label>

                    <label className="full">
                      Opis
                      <textarea
                        className="ap-input"
                        rows={4}
                        value={form.Opis}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, Opis: e.target.value }))
                        }
                      />
                    </label>

                    <label className="full">
                      Slika (1x) — opcionalno
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </>
                )}

                {entityType === "putovanje" && (
                  <>
                    <label className="full">
                      Opis
                      <textarea
                        className="ap-input"
                        rows={5}
                        value={form.Opis}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, Opis: e.target.value }))
                        }
                      />
                    </label>

                    <label className="full">
                      Fotografije (više)
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          setGallery(Array.from(e.target.files || []))
                        }
                      />
                    </label>
                  </>
                )}
              </div>

              <div className="ap-actions">
                <button
                  type="button"
                  className="ap-btn ghost"
                  onClick={() => setModalOpen(false)}
                >
                  Odustani
                </button>
                <button className="ap-btn" disabled={busy}>
                  {busy ? "Spremam…" : "Spremi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
