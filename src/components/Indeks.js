import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "../styles/indeks.css";

export default function Indeks() {
  const [kategorije, setKategorije] = useState([]);
  const [filter, setFilter] = useState("slatko"); // početni prikaz

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get(`/kategorijas?populate=*`);
        const arr = res.data?.data || [];

        setKategorije(
          arr.map((k) => ({
            id: k.id,
            documentId: k.documentId,
            ...k, // Strapi v5: data is directly on item, not in attributes
          }))
        );
      } catch (err) {
        console.error("Greška kod učitavanja kategorija:", err);
      }
    }
    load();
  }, []);

  // Filtriramo po tipu (slatko / slano)
  const filtered = kategorije.filter((k) => k.Tip === filter);

  return (
    <div className="indeks-page">
      <h1>Indeks recepata</h1>

      <p className="indeks-subtitle">
        Odaberi vrstu → zatim kategoriju → pa otkrij sve recepte.
      </p>

      {/* SLATKO / SLANO GUMBI */}
      <div className="toggle-group">
        <button
          className={`toggle-btn ${filter === "slatko" ? "active" : ""}`}
          onClick={() => setFilter("slatko")}
        >
          Slatko
        </button>

        <button
          className={`toggle-btn ${filter === "slano" ? "active" : ""}`}
          onClick={() => setFilter("slano")}
        >
          Slano
        </button>
      </div>

      {/* LISTA KATEGORIJA */}
      <div className="category-list">
        {filtered.map((k) => (
          <Link
            to={`/recipes?category=${k.Slug}`}
            key={k.id}
            className="category-item"
          >
            <h3>{k.Naziv}</h3>
            <span>
              {filter === "slatko" ? "Slatka kategorija" : "Slana kategorija"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
