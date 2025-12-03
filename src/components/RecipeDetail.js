// src/components/RecipeDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { API_BASE } from "../api";
import "../styles/recipe-detail.css";
import { FaPrint, FaFilePdf, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { RecipeDetailSkeleton } from "./LoadingSkeleton";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/recepts/${id}?populate=*`);
        const d = res.data.data;

        if (!d) {
          setError("Recept nije pronađen.");
          setLoading(false);
          return;
        }

        // Strapi v5 → direktni fieldovi
        setRecipe({
          id: d.id,
          documentId: d.documentId,
          Naslov: d.Naslov,
          KratkiOpis: d.KratkiOpis,
          Opis: d.Opis,
          Sastojci: d.Sastojci,
          Priprema: d.Priprema,
          Okus: d.Okus || d.Tip || "",
          Datum: d.Datum,

          // Kategorija u v5 je direktno objekt (ne u attributes)
          kategorija: d.Kategorijas?.Naziv || "Bez kategorije",

          // Slika — Strapi v5: array objekata
          thumb:
            d.Slika?.[0]?.url ? `${API_BASE}${d.Slika[0].url}` : null,
        });
        setLoading(false);
      } catch (err) {
        console.error("❌ Greška kod učitavanja recepta:", err);
        setError("Nije moguće učitati recept. Molimo pokušajte ponovo.");
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return <RecipeDetailSkeleton />;
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail">
        <div className="error-message">
          <h2>Ups! Nešto je pošlo po zlu</h2>
          <p>{error || "Recept nije pronađen."}</p>
          <button
            onClick={() => navigate("/")}
            className="btn-accent"
            style={{ marginTop: "20px" }}
          >
            <FaArrowLeft /> Vrati se na početnu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="back-button"
        aria-label="Nazad"
      >
        <FaArrowLeft /> Nazad
      </button>

      {/* HERO SLIKA */}
      {recipe.thumb && (
        <div className="recipe-hero">
          <img src={recipe.thumb} alt={recipe.Naslov} loading="eager" />
        </div>
      )}

      <div className="recipe-header">
        <h1>{recipe.Naslov}</h1>

        <p className="recipe-meta">
          <span>{recipe.kategorija}</span> · <span>{recipe.Okus}</span>{" "}
          {recipe.Datum && <><span> · </span><span>{recipe.Datum}</span></>}
        </p>

        {recipe.KratkiOpis && (
          <p className="recipe-short">{recipe.KratkiOpis}</p>
        )}
      </div>

      <div className="recipe-body">
        {/* SASTOJCI */}
        <div className="ingredients">
          <h2>Sastojci</h2>
          <div dangerouslySetInnerHTML={{ __html: recipe.Sastojci }} />
        </div>

        {/* PRIPREMA */}
        <div className="instructions">
          <h2>Priprema</h2>
          <div dangerouslySetInnerHTML={{ __html: recipe.Priprema }} />
        </div>
      </div>

      {/* NAPOMENA */}
      {recipe.Opis && (
        <div className="recipe-notes">
          <h2>Napomena</h2>
          <div dangerouslySetInnerHTML={{ __html: recipe.Opis }} />
        </div>
      )}

      {/* AKCIJE */}
      <div className="recipe-actions">
        <button onClick={() => window.print()} aria-label="Ispiši recept">
          <FaPrint /> Print
        </button>

        <a
          href={`https://www.printfriendly.com/p/g?url=${encodeURIComponent(
            window.location.href
          )}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Preuzmi PDF"
        >
          <FaFilePdf /> PDF
        </a>

        <button onClick={handleEmail} aria-label="Pošalji email">
          <FaEnvelope /> Email
        </button>
      </div>
    </div>
  );

  function handleEmail() {
    const subject = encodeURIComponent(`Pogledaj recept: ${recipe.Naslov}`);
    const body = encodeURIComponent(`Recept link: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }
}
