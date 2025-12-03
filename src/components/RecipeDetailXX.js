import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import "../styles/recipeDetail.css";

export default function RecipeDetail() {
  const { id } = useParams(); // dohvaća ID iz URL-a
  const [recept, setRecept] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecept() {
      try {
        const res = await API.get(`/recepts?filters[id][$eq]=${id}&populate=*`);
        console.log("📄 Recept detalj:", res.data.data);

        if (res.data.data && res.data.data.length > 0) {
          setRecept(res.data.data[0]); // uzmi prvi rezultat
        } else {
          setRecept(null);
        }
      } catch (error) {
        console.error("❌ Greška kod učitavanja recepta:", error);
        setRecept(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRecept();
  }, [id]);

  if (loading) return <p className="loading">Učitavanje recepta...</p>;
  if (!recept) return <p className="error">Recept nije pronađen.</p>;

  const r = recept;

  return (
    <div className="recipe-detail">
      <h1>{r.Naslov}</h1>

      {r.Slika?.[0]?.url && (
        <img
          src={`http://localhost:1337${r.Slika[0].url}`}
          alt={r.Naslov}
          className="recipe-img"
        />
      )}

      <p className="kratkiOpis">{r.KratkiOpis}</p>

      <div className="opis">
        <h3>Opis</h3>
        <p>{r.Opis}</p>
      </div>

      <div className="sastojci">
        <h3>Sastojci</h3>
        <pre>{r.Sastojci}</pre>
      </div>

      <div className="priprema">
        <h3>Priprema</h3>
        <pre>{r.Priprema}</pre>
      </div>

      <p className="meta">
        🍴 {r.Okus?.includes("slatko") ? "Slatko jelo" : "Slano jelo"}
        <br />
        👩‍🍳 Autor: {r.Autor || "Nepoznato"}
        <br />
        📅 {r.Datum ? new Date(r.Datum).toLocaleDateString("hr-HR") : ""}
      </p>
    </div>
  );
}
