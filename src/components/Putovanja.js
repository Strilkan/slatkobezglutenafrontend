import React, { useEffect, useState } from "react";
import API, { API_BASE } from "../api";
import "../styles/putovanja.css";

export default function Putovanja() {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTravels();
  }, []);

  async function loadTravels() {
    try {
      const res = await API.get("/putovanjas?populate=*");

      const arr = res.data?.data || [];

      // Strapi v5 → direktni fieldovi (nema attributes)
      setTravels(
        arr.map((t) => {
          const img = t.Fotografija?.[0]?.url
            ? API_BASE + t.Fotografija[0].url
            : null;

          return {
            id: t.id,
            title: t.Naslov,
            excerpt: t.Opis,
            image: img,
            location: t.Lokacija,
          };
        })
      );
    } catch (err) {
      console.error("❌ Greška kod učitavanja putovanja:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="putovanja-page">
        <h1>Učitavanje putovanja...</h1>
      </div>
    );
  }

  return (
    <div className="putovanja-page">
      <header className="putovanja-hero">
        <h1>Bezglutenska putovanja</h1>
        <p>
          Otkrijte gluten-free avanture diljem svijeta — gdje jesti, što probati
          i kako uživati bez brige u svakoj destinaciji.
        </p>
      </header>

      <section className="putovanja-grid">
        {travels.map((t) => (
          <article key={t.id} className="putovanje-card">
            {t.image ? (
              <img src={t.image} alt={t.title} />
            ) : (
              <div className="no-image">Nema slike</div>
            )}

            <h2>{t.title}</h2>
            <p className="lokacija">{t.location}</p>
            <p>{t.excerpt}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
