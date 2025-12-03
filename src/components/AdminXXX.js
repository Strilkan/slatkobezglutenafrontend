import React, { useEffect, useMemo, useState } from "react";
import API from "../api";
import "../styles/admin.css";

export default function Admin() {
  const token = localStorage.getItem("token") || "";
  const isAuthed = !!token;

  // ---------- UI state ----------
  const [saving, setSaving] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });

  // ---------- data ----------
  const [recipes, setRecipes] = useState([]);
  const [kategorije, setKategorije] = useState([]);

  // ---------- form ----------
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    Naslov: "",
    KratkiOpis: "",
    Opis: "",
    Sastojci: "",
    Priprema: "",
    Okus: "slatko", // ✅ veliko slovo
    Istaknuto: false,
    Datum: new Date().toISOString().slice(0, 10),
    Autor: "admin",
  });

  // ---------- helpers ----------
  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: "", msg: "" }), 3500);
  }

  // normalize API data (v4/v5 compatible)
  function normalizeRecept(raw) {
    if (!raw) return null;
    const a = raw.attributes || raw;
    return {
      id: raw.id,
      Naslov: a.Naslov,
      KratkiOpis: a.KratkiOpis,
      Opis: a.Opis,
      Sastojci: a.Sastojci,
      Priprema: a.Priprema,
      Okus: a.Okus,
      Istaknuto: a.Istaknuto,
      Datum: a.Datum,
      Autor: a.Autor,
      Slika: a.Slika,
      thumbUrl: (() => {
        const media = a.Slika;
        if (!media) return "";
        if (Array.isArray(media) && media[0]?.url) {
          return media[0].url.startsWith("http")
            ? media[0].url
            : `http://localhost:1337${media[0].url}`;
        }
        if (media?.url) {
          return media.url.startsWith("http")
            ? media.url
            : `http://localhost:1337${media.url}`;
        }
        return "";
      })(),
    };
  }

  // ---------- headers ----------
  const authHeaders = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  // ---------- load recipes ----------
  async function loadRecipes() {
    setLoadingList(true);
    try {
      const res = await API.get(`/recepts?populate=*`, authHeaders);
      const arr = Array.isArray(res.data?.data) ? res.data.data : [];
      setRecipes(arr.map(normalizeRecept).filter(Boolean));
    } catch (err) {
      console.error("❌ Greška kod učitavanja recepata:", err);
      showToast("error", "Greška kod učitavanja recepata");
    } finally {
      setLoadingList(false);
    }
  }

  async function loadKategorije() {
    try {
      const res = await API.get(`/kategorijas`, authHeaders);
      const arr = Array.isArray(res.data?.data) ? res.data.data : [];
      setKategorije(arr.map((x) => ({ id: x.id, ...(x.attributes || x) })));
    } catch (e) {}
  }

  useEffect(() => {
    if (isAuthed) {
      loadRecipes();
      loadKategorije();
    }
  }, [isAuthed]);

  // ---------- handlers ----------
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isAuthed) {
      showToast("error", "Niste prijavljeni.");
      return;
    }

    setSaving(true);
    try {
      // 1️⃣ Upload slike
      let uploadedImageId = null;

      if (file) {
        const fd = new FormData();
        fd.append("files", file);

        const up = await fetch(`http://localhost:1337/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        });

        if (!up.ok) {
          const errJson = await up.json().catch(() => ({}));
          throw new Error(
            `Upload nije prošao (${up.status}). ${
              errJson?.error?.message || ""
            }`
          );
        }
        const uploaded = await up.json();
        uploadedImageId = uploaded?.[0]?.id || null;
      }

      // 2️⃣ Payload
      const payload = {
        data: {
          Naslov: form.Naslov,
          KratkiOpis: form.KratkiOpis,
          Opis: form.Opis,
          Sastojci: form.Sastojci,
          Priprema: form.Priprema,
          Okus: form.Okus,
          Istaknuto: form.Istaknuto,
          Datum: form.Datum,
          Autor: form.Autor,
        },
      };

      if (uploadedImageId !== null) {
        payload.data.Slika = [uploadedImageId];
      }

      // 3️⃣ Spremi recept
      const res = await API.post(`/recepts`, payload, authHeaders);

      if (res?.data?.data?.id) {
        showToast("success", "✅ Recept spremljen!");
        setForm({
          Naslov: "",
          KratkiOpis: "",
          Opis: "",
          Sastojci: "",
          Priprema: "",
          Okus: "slatko",
          Istaknuto: false,
          Datum: new Date().toISOString().slice(0, 10),
          Autor: "admin",
        });
        setFile(null);
        await loadRecipes();
      } else {
        showToast("error", "Greška prilikom spremanja recepta.");
      }
    } catch (err) {
      console.error("🚫 Greška:", err);
      const m =
        err?.response?.data?.error?.message ||
        err?.message ||
        "Greška prilikom spremanja recepta.";
      showToast("error", `🚫 ${m}`);
    } finally {
      setSaving(false);
    }
  }

  // ---------- render ----------
  if (!isAuthed) {
    return (
      <div className="admin-wrap">
        <div className="admin-card">
          <h1>🔒 Admin zona</h1>
          <p>Za pristup panelu trebaš biti prijavljen.</p>
          <a className="btn" href="/prijava">
            Idi na prijavu
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      {toast.msg && (
        <div
          className={`toast ${
            toast.type === "error" ? "toast-err" : "toast-ok"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-title">
          <h1>➕ Novi recept</h1>
          <button
            className="btn btn-ghost"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/prijava";
            }}
          >
            Odjava
          </button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="grid-2">
            <label>
              Naslov
              <input
                name="Naslov"
                value={form.Naslov}
                onChange={handleChange}
                placeholder="Bezglutenska torta od čokolade"
                required
              />
            </label>

            <label>
              Autor
              <input
                name="Autor"
                value={form.Autor}
                onChange={handleChange}
                placeholder="admin"
              />
            </label>

            <label className="full">
              Kratki opis
              <input
                name="KratkiOpis"
                value={form.KratkiOpis}
                onChange={handleChange}
                placeholder="Sočna, bogata i bez glutena…"
              />
            </label>

            <label>
              Datum
              <input
                type="date"
                name="Datum"
                value={form.Datum}
                onChange={handleChange}
              />
            </label>

            <label>
              Okus
              <select name="Okus" value={form.Okus} onChange={handleChange}>
                <option value="slatko">Slatko</option>
                <option value="slano">Slano</option>
              </select>
            </label>

            <label className="chk">
              <input
                type="checkbox"
                name="Istaknuto"
                checked={form.Istaknuto}
                onChange={handleChange}
              />
              Istaknuto (slider)
            </label>

            <label className="full">
              Sastojci
              <textarea
                name="Sastojci"
                value={form.Sastojci}
                onChange={handleChange}
                rows={4}
                placeholder="150 g bademovog brašna…"
              />
            </label>

            <label className="full">
              Priprema
              <textarea
                name="Priprema"
                value={form.Priprema}
                onChange={handleChange}
                rows={5}
                placeholder="1) Rastopite čokoladu…"
              />
            </label>

            <label className="full">
              Opis
              <textarea
                name="Opis"
                value={form.Opis}
                onChange={handleChange}
                rows={4}
                placeholder="Kratki uvod, savjeti…"
              />
            </label>

            <label className="full">
              Slika (upload)
              <div className="drop">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? <span>{file.name}</span> : <span>Odaberi sliku…</span>}
              </div>
            </label>
          </div>

          <div className="form-actions">
            <button className="btn" disabled={saving}>
              {saving ? "Spremam…" : "Spremi recept"}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <div className="admin-title">
          <h2>📚 Recepti</h2>
          <button
            className="btn btn-ghost"
            onClick={loadRecipes}
            disabled={loadingList}
          >
            {loadingList ? "Učitavam…" : "Osvježi"}
          </button>
        </div>

        {!recipes.length && <p>Nema recepata još. Dodaj prvi! 😊</p>}

        <div className="cards">
          {recipes.map((r) => (
            <div className="card" key={r.id}>
              <div className="thumb">
                {r.thumbUrl ? (
                  <img src={r.thumbUrl} alt={r.Naslov} />
                ) : (
                  <div className="ph">IMG</div>
                )}
              </div>
              <div className="meta">
                <h3>{r.Naslov}</h3>
                <p className="muted">
                  {r.Okus ? r.Okus.toUpperCase() : ""} ·{" "}
                  {r.Istaknuto ? "ISTAKNUTO" : "—"}
                </p>
                {r.KratkiOpis && <p className="desc">{r.KratkiOpis}</p>}
              </div>
              <a
                className="btn btn-small"
                href={`/recipes/${r.id}`}
                target="_blank"
                rel="noreferrer"
              >
                Otvori
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
