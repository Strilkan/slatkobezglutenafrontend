import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import API, { API_BASE } from "../api";
import "../styles/recipes.css";

export default function Recipes() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");

  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        let categoryData = null;

        // Ako postoji slug → učitaj kategoriju
        if (categorySlug) {
          const resCat = await API.get(
            `/kategorijas?filters[Slug][$eq]=${categorySlug}&populate=*`
          );

          categoryData = resCat.data?.data?.[0] || null;

          if (categoryData) {
            setCategory({
              id: categoryData.id,
              Naziv: categoryData.Naziv,
              Opis: categoryData.Opis,
              Slug: categoryData.Slug,
            });
          } else {
            setCategory(null);
          }
        }

        // Endpoint za recepte
        const endpoint = categorySlug
          ? `/recepts?filters[Kategorijas][id][$eq]=${categoryData?.id}&populate=*`
          : `/recepts?populate=*`;

        const res = await API.get(endpoint);
        const arr = res.data?.data || [];

        // Mappiranje recepata (Strapi v5 – direktna polja)
        setRecipes(
          arr.map((r) => ({
            id: r.id,
            documentId: r.documentId,
            title: r.Naslov,
            description: r.KratkiOpis,
            image: r.Slika?.[0]?.url ? `${API_BASE}${r.Slika[0].url}` : null,
            slug: r.Slug,
          }))
        );
      } catch (err) {
        console.error("❌ Greška kod dohvata recepata:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [categorySlug]);

  if (loading) return <p className="loading">Učitavanje recepata…</p>;

  return (
    <div className="recipes-page">
      <header className="recipes-hero">
        <h1>
          {categorySlug ? category?.Naziv || "Kategorija" : "Svi recepti"}
        </h1>

        <p>
          {categorySlug
            ? `Recepti iz kategorije "${category?.Naziv}".`
            : "Pregled svih bezglutenskih recepata."}
        </p>
      </header>

      <section className="recipes-grid">
        {recipes.length > 0 ? (
          recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
        ) : (
          <p>Nema recepata u ovoj kategoriji 😊</p>
        )}
      </section>
    </div>
  );
}
