import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API, { API_BASE } from "../api";
import { RecipeCardSkeleton } from "./LoadingSkeleton";
import "../styles/category.css";

export default function Category() {
  const [params] = useSearchParams();
  const categorySlug = params.get("category");

  const [category, setCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        // ❗ Ako nema sluga → prikaz svih recepata
        if (!categorySlug) {
          const resR = await API.get(`/recepts?populate=*`);
          const arr = resR.data?.data || [];

          setRecipes(
            arr.map((r) => ({
              id: r.id,
              documentId: r.documentId,
              Naslov: r.Naslov,
              KratkiOpis: r.KratkiOpis,
              thumb: r.Slika?.[0]?.url ? `${API_BASE}${r.Slika[0].url}` : null,
            }))
          );

          setCategory({
            Naziv: "Svi recepti",
            Opis: "Pregled svih bezglutenskih recepata.",
          });
          setLoading(false);
          return;
        }

        // 1) Dohvati kategoriju po slug-u
        const resK = await API.get(
          `/kategorijas?filters[Slug][$eq]=${categorySlug}&populate=*`
        );

        const item = resK.data?.data?.[0];
        if (!item) {
          setError("Kategorija nije pronađena.");
          setLoading(false);
          return;
        }

        // Strapi v5 → direktna polja (nema attributes)
        const cat = {
          id: item.id,
          documentId: item.documentId,
          Naziv: item.Naziv,
          Opis: item.Opis,
          Slug: item.Slug,
        };

        setCategory(cat);

        // 2) Dohvati recepte iz kategorije
        const resR = await API.get(
          `/recepts?filters[Kategorijas][id][$eq]=${cat.id}&populate=*`
        );

        const arr = resR.data?.data || [];

        setRecipes(
          arr.map((r) => ({
            id: r.id,
            documentId: r.documentId,
            Naslov: r.Naslov,
            KratkiOpis: r.KratkiOpis,
            thumb: r.Slika?.[0]?.url ? `${API_BASE}${r.Slika[0].url}` : null,
          }))
        );
        setLoading(false);
      } catch (err) {
        console.error("❌ Greška:", err);
        setError("Greška kod učitavanja recepata.");
        setLoading(false);
      }
    }

    load();
  }, [categorySlug]);

  if (error)
    return (
      <div className="category-wrap">
        <div className="error-message">
          <h2>Ups! Nešto je pošlo po zlu</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-accent"
            style={{ marginTop: "20px" }}
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );

  if (loading || !category)
    return (
      <div className="category-wrap">
        <header className="category-header">
          <div className="skeleton-title-large" style={{ margin: "0 auto 20px", height: "40px", width: "60%" }}></div>
          <div className="skeleton-text" style={{ margin: "0 auto", height: "20px", width: "80%" }}></div>
        </header>
        <section className="category-grid">
          {[...Array(6)].map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </section>
      </div>
    );

  return (
    <div className="category-wrap">
      <header className="category-header">
        <h1>{category.Naziv}</h1>
        {category.Opis && <p>{category.Opis}</p>}
      </header>

      <section className="category-grid">
        {recipes.length > 0 ? (
          recipes.map((r) => (
            <Link
              to={`/recipes/${r.documentId || r.id}`}
              key={r.id}
              className="recipe-card"
            >
              {r.thumb ? (
                <img src={r.thumb} alt={r.Naslov} loading="lazy" />
              ) : (
                <div className="no-img">Nema slike</div>
              )}

              <h3>{r.Naslov}</h3>
              {r.KratkiOpis && <p>{r.KratkiOpis}</p>}
            </Link>
          ))
        ) : (
          <p className="no-recipes">Nema recepata u ovoj kategoriji još 😊</p>
        )}
      </section>
    </div>
  );
}
