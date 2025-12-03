import React, { useEffect, useMemo, useState } from "react";
import API from "../api";
import "../styles/admin-panel.css";

const MEDIA_URL = "https://slatkobezglutenabackend.onrender.com";
export default function AdminPanel() {
  const token = localStorage.getItem("token") || "";
  const isAuthed = !!token;

  const [tab, setTab] = useState("recepti");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("-Datum");
  const [toast, setToast] = useState({ type: "", msg: "" });
  const [busy, setBusy] = useState(false);

  const [recepti, setRecepti] = useState([]);
  const [putovanja, setPutovanja] = useState([]);
  const [kategorije, setKategorije] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [entityType, setEntityType] = useState("recept");
  const [editingId, setEditingId] = useState(null);

  const emptyRecept = {
    Naslov: "",
    Slug: "",
    KratkiOpis: "",
    Opis: "",
    Sastojci: "",
    Priprema: "",
    Istaknuto: false,
    Datum: new Date().toISOString().slice(0, 10),
    Autor: "admin",
    Tip: "slatko",
    Kategorijas: null,
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
  const [file, setFile] = useState(null);
  const [gallery, setGallery] = useState([]);

  const headersAuth = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  // -----------------------------
  // HELPERS
  // -----------------------------

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: "", msg: "" }), 2500);
  }

  // Auto-generate slug from title
  function generateSlug(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
      .replace(/^-+|-+$/g, "") // Remove leading/trailing dashes
      .substring(0, 100); // Limit length
  }

  function mediaThumb(m) {
    if (!m) return "";
    // Podržavamo i v4 i flat response
    if (Array.isArray(m)) {
      const first = m[0];
      if (!first) return "";
      const url =
        first.url ||
        first?.attributes?.url ||
        (first?.formats?.thumbnail?.url ?? "");
      if (!url) return "";
      return url.startsWith("http") ? url : MEDIA_URL + url;
    }

    const url = m.url || m?.attributes?.url || m?.formats?.thumbnail?.url;
    return url ? (url.startsWith("http") ? url : MEDIA_URL + url) : "";
  }

  function convertSort(s) {
    if (s === "-Datum") return "Datum:desc";
    if (s === "Datum") return "Datum:asc";
    return s;
  }

  function buildFilter() {
    return query ? `&filters[Naslov][$containsi]=${query}` : "";
  }

  // -----------------------------
  // LOAD FUNKCIJE
  // -----------------------------

  async function loadKategorije() {
    try {
      const res = await API.get("/kategorijas?pagination[pageSize]=100");
      const arr = res.data?.data || [];
      setKategorije(arr.map((k) => ({ id: k.id, ...(k.attributes || k) })));
    } catch (err) {
      console.error("Greška kod učitavanja kategorija:", err);
      if (err.response?.status === 403) {
        showToast("error", "Nemate dozvole za pristup. Provjerite da li ste u 'Authenticated' role-u u Strapi admin panelu.");
      }
    }
  }

  async function loadRecepti() {
    try {
      // Dodaj cache busting parametar da osiguramo fresh podatke
      const cacheBuster = `&_t=${Date.now()}`;
      const res = await API.get(
        `/recepts?populate=*&sort=${convertSort(sort)}${buildFilter()}${cacheBuster}`
      );

      console.log("📦 Load recepti response:", res.data);
      const arr = res.data?.data || [];
      console.log("📦 Recepti array:", arr);
      console.log("📦 First recept sample:", arr[0]);
      if (arr[0]) {
        console.log("📦 First recept keys:", Object.keys(arr[0]));
        console.log("📦 First recept id:", arr[0].id, typeof arr[0].id);
        console.log("📦 First recept documentId:", arr[0].documentId);
      }

      setRecepti(
        arr.map((x) => {
          // Strapi v5 - podaci su direktno u objektu, ne u attributes
          const at = x.attributes || x;
          // U Strapi v5, x.id može biti documentId ili numeric ID
          // Provjeri da li je numeric ID ili documentId
          const numericId = typeof x.id === 'number' ? x.id : null;
          const docId = x.documentId || (typeof x.id === 'string' ? x.id : null);
          const mapped = {
            id: numericId || docId || x.id, // Koristi numeric ID ako postoji, inače documentId
            documentId: docId || x.id, // Spremi documentId za update/delete
            _originalId: x.id, // Spremi original ID za debug
            Naslov: at.Naslov || "",
            Slug: at.Slug || "",
            KratkiOpis: at.KratkiOpis || "",
            Opis: at.Opis || "",
            Sastojci: at.Sastojci || "",
            Priprema: at.Priprema || "",
            Istaknuto: at.Istaknuto || false,
            Datum: at.Datum || "",
            Autor: at.Autor || "",
            Tip: at.Tip || "",
            thumb: mediaThumb(at.Slika),
            Kategorijas: at.Kategorijas?.data || at.Kategorijas || null,
          };
          console.log("📦 Mapped recept:", mapped);
          return mapped;
        })
      );
      
      console.log(`✅ Loaded ${arr.length} recepata`);
    } catch (err) {
      console.error("Greška kod učitavanja recepata:", err);
      const errorMsg = err.response?.data?.error?.message || 
                       err.message || 
                       "Nije moguće učitati recepte. Provjerite da li je backend aktivan.";
      showToast("error", errorMsg);
      setRecepti([]);
    }
  }

  async function loadPutovanja() {
    try {
      const res = await API.get(
        `/putovanjas?populate=*&sort=${convertSort(sort)}${buildFilter()}`
      );

      const arr = res.data?.data || [];

      setPutovanja(
        arr.map((x) => {
          const at = x.attributes || x;
          return {
            id: x.id,
            documentId: x.documentId || x.id, // Spremi documentId za update/delete
            Naslov: at.Naslov || "",
            Slug: at.Slug || "",
            Lokacija: at.Lokacija || "",
            Opis: at.Opis || "",
            Istaknuto: at.Istaknuto || false,
            Datum: at.Datum || "",
            thumb: mediaThumb(at.Fotografija),
          };
        })
      );
    } catch (err) {
      console.error("Greška kod učitavanja putovanja:", err);
      const errorMsg = err.response?.data?.error?.message || 
                       err.message || 
                       "Nije moguće učitati putovanja.";
      showToast("error", errorMsg);
      setPutovanja([]);
    }
  }

  useEffect(() => {
    if (!isAuthed) return;
    loadKategorije();
    if (tab === "recepti") loadRecepti();
    if (tab === "putovanja") loadPutovanja();
  }, [isAuthed, tab, sort]);

  useEffect(() => {
    if (!isAuthed) return;
    const t = setTimeout(() => {
      if (tab === "recepti") loadRecepti();
      if (tab === "putovanja") loadPutovanja();
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // -----------------------------
  // MODAL OPEN / CLOSE
  // -----------------------------

  function openCreate(type) {
    setEntityType(type);
    setEditingId(null);
    setForm(type === "recept" ? { ...emptyRecept } : { ...emptyPutovanje });
    setFile(null);
    setGallery([]);
    setModalOpen(true);
  }

  function openEdit(type, it) {
    setEntityType(type);
    // Koristi documentId ako postoji (Strapi v5 preferira documentId), inače numeric ID
    setEditingId(it.documentId || it.id);

    if (type === "recept") {
      setForm({
        Naslov: it.Naslov,
        Slug: it.Slug,
        KratkiOpis: it.KratkiOpis,
        Opis: it.Opis,
        Sastojci: it.Sastojci,
        Priprema: it.Priprema,
        Istaknuto: it.Istaknuto,
        Datum: it.Datum
          ? it.Datum.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        Autor: it.Autor,
        Tip: it.Tip || "slatko",
        Kategorijas: it.Kategorijas?.id ?? null,
      });
    } else {
      setForm({
        Naslov: it.Naslov,
        Slug: it.Slug,
        Lokacija: it.Lokacija,
        Opis: it.Opis,
        Istaknuto: it.Istaknuto,
        Datum: it.Datum
          ? it.Datum.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      });
    }

    setFile(null);
    setGallery([]);
    setModalOpen(true);
  }

  // -----------------------------
  // UPLOAD
  // -----------------------------

  async function uploadFiles(files) {
    if (!files?.length) return [];
    
    // Get fresh token from localStorage
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      throw new Error("Niste prijavljeni. Molimo prijavite se ponovo.");
    }
    
    // First verify token is valid by checking user info
    try {
      const userRes = await fetch(`${MEDIA_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      
      if (!userRes.ok) {
        console.error("❌ Token validation failed:", userRes.status);
        throw new Error("Token nije valjan. Molimo prijavite se ponovo.");
      }
      
      const userData = await userRes.json();
      console.log("✅ User info:", userData);
    } catch (err) {
      if (err.message.includes("Token")) {
        throw err;
      }
      console.warn("⚠️ Could not verify user, continuing with upload...");
    }
    
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));

    try {
      const res = await fetch(`${MEDIA_URL}/api/upload`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${currentToken}`,
          // Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: fd,
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          // If response is not JSON, use status text
          errorData = { error: { message: res.statusText || "Upload failed" } };
        }
        
        console.error("❌ Upload error:", {
          status: res.status,
          statusText: res.statusText,
          error: errorData,
          fullResponse: errorData
        });
        
        if (res.status === 401) {
          throw new Error("Token je istekao. Molimo prijavite se ponovo.");
        }
        
        if (res.status === 403) {
          const errorMsg = errorData.error?.message || errorData.message || "Nemate dozvole za upload.";
          throw new Error(`${errorMsg} Provjerite da li ste u 'Authenticated' role-u i imate upload permissions u Strapi admin panelu.`);
        }
        
        throw new Error(errorData.error?.message || errorData.message || `Upload failed: ${res.statusText}`);
      }

      const json = await res.json();
      console.log("📦 Upload response:", json);

      // Strapi v5 can return different formats:
      // 1. Direct array: [{id: 1, ...}, {id: 2, ...}]
      // 2. Object with data: {data: [{id: 1, ...}]}
      // 3. Single object: {id: 1, ...}
      
      let filesArray = [];
      
      if (Array.isArray(json)) {
        filesArray = json;
      } else if (json.data && Array.isArray(json.data)) {
        filesArray = json.data;
      } else if (json.id) {
        // Single file uploaded
        filesArray = [json];
      } else {
        console.error("❌ Unexpected upload response format:", json);
        throw new Error("Unexpected upload response format");
      }

      return filesArray.map((m) => m.id);
    } catch (err) {
      console.error("❌ Upload error:", err);
      throw err;
    }
  }

  // -----------------------------
  // SAVE (CREATE / UPDATE)
  // -----------------------------

  async function handleSave(e) {
    e.preventDefault();
    setBusy(true);

    try {
      let uploaded = [];

      if (entityType === "recept" && file) {
        uploaded = await uploadFiles([file]);
      }

      if (entityType === "putovanje" && gallery.length) {
        uploaded = await uploadFiles(gallery);
      }

      // payload gradimo ručno da ne šaljemo gluposti
      const data = {};

      if (entityType === "recept") {
        data.Naslov = form.Naslov || "";
        if (form.Slug) data.Slug = form.Slug; // slug je uid, Strapi može i sam generirati
        data.KratkiOpis = form.KratkiOpis || "";
        data.Opis = form.Opis || "";
        data.Sastojci = form.Sastojci || "";
        data.Priprema = form.Priprema || "";
        data.Istaknuto = !!form.Istaknuto;
        data.Datum = form.Datum || null;
        data.Autor = form.Autor || "";
        data.Tip = form.Tip || "slatko";

        if (form.Kategorijas) {
          data.Kategorijas = Number(form.Kategorijas);
        } else {
          data.Kategorijas = null;
        }

        if (uploaded.length) {
          data.Slika = uploaded;
        }
      } else {
        // putovanje
        data.Naslov = form.Naslov || "";
        if (form.Slug) data.Slug = form.Slug;
        data.Lokacija = form.Lokacija || "";
        data.Opis = form.Opis || "";
        data.Istaknuto = !!form.Istaknuto;
        data.Datum = form.Datum || null;
        if (uploaded.length) {
          data.Fotografija = uploaded;
        }
      }

      if (editingId) {
        // UPDATE
        console.log(`✏️ Frontend: Updating ${entityType} with ID: ${editingId} (type: ${typeof editingId})`, data);
        
        const res = await API.put(
          `/${entityType === "recept" ? "recepts" : "putovanjas"}/${editingId}`,
          { data },
          headersAuth
        );
        
        console.log("Update response:", res);
        
        showToast("ok", "Spremljeno");
      } else {
        // CREATE
        console.log(`Creating new ${entityType}`, data);
        
        const res = await API.post(
          `/${entityType === "recept" ? "recepts" : "putovanjas"}`,
          { data },
          headersAuth
        );
        
        console.log("Create response:", res);
        
        showToast("ok", "Dodano");
      }

      setModalOpen(false);
      
      // Pričekaj malo da se backend obradi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force reload listu - osiguraj da se podaci osvježe
      if (tab === "recepti") {
        console.log("🔄 Reloading recepti after save...");
        await loadRecepti();
        console.log("✅ Recepti reloaded");
      } else {
        console.log("🔄 Reloading putovanja after save...");
        await loadPutovanja();
        console.log("✅ Putovanja reloaded");
      }
    } catch (err) {
      console.error("Greška kod spremanja:", err);
      const errorMsg = err.message || "Greška kod spremanja";
      showToast("error", errorMsg);
    } finally {
      setBusy(false);
    }
  }

  // -----------------------------
  // DELETE
  // -----------------------------

  async function handleDelete(type, it) {
    if (!window.confirm("Obrisati?")) return;

    try {
      // U Strapi v5, koristi documentId jer je to primarni identifikator
      // Backend će pronaći entitet po documentId ili numeric ID
      const deleteId = it.documentId || it.id || it._originalId;
      console.log(`🗑️ Frontend: Deleting ${type}`);
      console.log(`🗑️ Frontend: Item object:`, it);
      console.log(`🗑️ Frontend: Using ID for delete: ${deleteId} (type: ${typeof deleteId})`);
      console.log(`🗑️ Frontend: Item.id:`, it.id, typeof it.id);
      console.log(`🗑️ Frontend: Item.documentId:`, it.documentId);
      
      if (!deleteId) {
        console.error(`🗑️ Frontend: ERROR - No ID found! Item:`, it);
        showToast("error", "Greška: ID nije pronađen");
        return;
      }
      
      // Koristi documentId ako postoji (Strapi v5 preferira documentId)
      const urlId = it.documentId || it.id;
      console.log(`🗑️ Frontend: Sending DELETE to: /${type === "recept" ? "recepts" : "putovanjas"}/${urlId}`);
      
      const res = await API.delete(
        `/${type === "recept" ? "recepts" : "putovanjas"}/${urlId}`,
        headersAuth
      );
      
      console.log("Delete response:", res);
      
      // Pričekaj malo da se backend obradi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast("ok", "Obrisano");
      
      // Force reload listu
      console.log(`🔄 Reloading after delete ${type}...`);
      if (type === "recept") {
        await loadRecepti();
        console.log("✅ Recepti reloaded after delete");
      } else {
        await loadPutovanja();
        console.log("✅ Putovanja reloaded after delete");
      }
    } catch (err) {
      console.error("Greška kod brisanja:", err);
      console.error("Delete error details:", {
        response: err.response,
        data: err.response?.data,
        status: err.response?.status
      });
      const errorMsg = err.response?.data?.error?.message || 
                       err.message || 
                       "Greška kod brisanja";
      showToast("error", errorMsg);
    }
  }

  // -----------------------------
  // TOGGLE ISTAKNUTO
  // -----------------------------

  async function toggleIstaknuto(type, it) {
    try {
      // Koristi documentId ako postoji (Strapi v5 preferira documentId), inače numeric ID
      const updateId = it.documentId || it.id;
      const newValue = !it.Istaknuto;
      
      console.log(`⭐ Frontend: Toggling Istaknuto for ${type} with ID: ${updateId} (type: ${typeof updateId}) to ${newValue}`);
      console.log(`⭐ Frontend: Item object:`, it);
      
      const res = await API.put(
        `/${type === "recept" ? "recepts" : "putovanjas"}/${updateId}`,
        { data: { Istaknuto: newValue } },
        headersAuth
      );
      
      console.log("Toggle response:", res);
      
      // Pričekaj malo da se backend obradi
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Force reload listu
      console.log(`🔄 Reloading after toggle Istaknuto for ${type}...`);
      if (type === "recepti") {
        await loadRecepti();
        console.log("✅ Recepti reloaded after toggle");
      } else {
        await loadPutovanja();
        console.log("✅ Putovanja reloaded after toggle");
      }
    } catch (err) {
      console.error("Greška kod isticanja:", err);
      console.error("Toggle error details:", {
        response: err.response,
        data: err.response?.data,
        status: err.response?.status
      });
      const errorMsg = err.response?.data?.error?.message || 
                       err.message || 
                       "Greška kod isticanja";
      showToast("error", errorMsg);
    }
  }

  // -----------------------------
  // AUTH CHECK
  // -----------------------------

  if (!isAuthed) {
    return (
      <div className="ap-wrap">
        <div className="ap-card">
          <h1>🔒 Admin</h1>
          <p>Prijavi se za pristup.</p>
          <a href="/prijava" className="ap-btn">
            Idi na prijavu
          </a>
        </div>
      </div>
    );
  }

  // -----------------------------
  // UI LAYOUT
  // -----------------------------

  return (
    <div className="ap-wrap">
      {toast.msg && (
        <div className={`ap-toast ${toast.type === "error" ? "err" : "ok"}`}>
          {toast.msg}
        </div>
      )}

      {/* TOOLBAR */}
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
            placeholder="Pretraži…"
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
            ➕ Novo
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

      {/* LISTA */}
      <div className="ap-grid">
        {(tab === "recepti" ? recepti : putovanja).map((it) => (
          <div key={it.id} className="ap-card ap-item">
            <div className="thumb">
              {it.thumb ? <img src={it.thumb} alt="" /> : <span>IMG</span>}
            </div>

            <div className="meta">
              <h3>{it.Naslov}</h3>
              <p className="muted">
                {tab === "recepti"
                  ? (it.Tip || "").toUpperCase()
                  : it.Lokacija || "—"}{" "}
                · {it.Istaknuto ? "ISTAKNUTO" : "—"}
              </p>

              {tab === "recepti" && (
                <p className="muted small">
                  Kategorija: {it.Kategorijas?.Naziv || "—"}
                </p>
              )}
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
                {it.Istaknuto ? "Makni" : "Istakni"}
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
                    it
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
                {editingId ? "Uredi" : "Dodaj"} {entityType}
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
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setForm((f) => ({
                        ...f,
                        Naslov: newTitle,
                        // Auto-generate slug only if it's empty or matches the old title pattern
                        Slug: !f.Slug || f.Slug === generateSlug(f.Naslov)
                          ? generateSlug(newTitle)
                          : f.Slug,
                      }));
                    }}
                  />
                </label>

                <label>
                  Slug (automatski generiran)
                  <input
                    className="ap-input"
                    value={form.Slug || ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, Slug: e.target.value }))
                    }
                    placeholder="Auto-generiše se iz naslova"
                  />
                  <small style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                    Može se ručno urediti ako je potrebno
                  </small>
                </label>

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
                    checked={form.Istaknuto}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, Istaknuto: e.target.checked }))
                    }
                  />
                  Istaknuto
                </label>

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
                      Tip (slatko/slano)
                      <select
                        className="ap-input"
                        value={form.Tip}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, Tip: e.target.value }))
                        }
                      >
                        <option value="slatko">Slatko</option>
                        <option value="slano">Slano</option>
                      </select>
                    </label>

                    <label>
                      Kategorija
                      <select
                        className="ap-input"
                        value={form.Kategorijas ?? ""}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            Kategorijas: e.target.value
                              ? Number(e.target.value)
                              : null,
                          }))
                        }
                      >
                        <option value="">— odaberi —</option>
                        {kategorije.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.Naziv} ({k.Tip})
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="full">
                      Kratki opis
                      <input
                        className="ap-input"
                        value={form.KratkiOpis}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            KratkiOpis: e.target.value,
                          }))
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
                          setForm((f) => ({
                            ...f,
                            Sastojci: e.target.value,
                          }))
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
                          setForm((f) => ({
                            ...f,
                            Priprema: e.target.value,
                          }))
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
                          setForm((f) => ({
                            ...f,
                            Opis: e.target.value,
                          }))
                        }
                      />
                    </label>

                    <label className="full">
                      Slika (1x)
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
                    <label>
                      Lokacija
                      <input
                        className="ap-input"
                        value={form.Lokacija}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, Lokacija: e.target.value }))
                        }
                      />
                    </label>

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
                  className="ap-btn ghost"
                  type="button"
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
