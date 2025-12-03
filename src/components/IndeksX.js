import React from "react";
import { Link } from "react-router-dom";
import "../styles/indeks.css";

import torte from "../assets/images/torte.jpg";
import keksi from "../assets/images/keksi.jpg";
import pite from "../assets/images/pite.jpg";
import kruh from "../assets/images/kruh.jpg";
import focaccia from "../assets/images/focaccia.jpg";
import palacinke from "../assets/images/palacinke.jpg";

export default function Indeks() {
  const categories = [
    { name: "Torte", slug: "torte", image: torte, type: "slatko" },
    { name: "Keksi", slug: "keksi", image: keksi, type: "slatko" },
    { name: "Pite", slug: "pite", image: pite, type: "slatko" },
    { name: "Kruh", slug: "kruh", image: kruh, type: "slano" },
    { name: "Focaccia", slug: "focaccia", image: focaccia, type: "slano" },
    { name: "Palačinke", slug: "palacinke", image: palacinke, type: "slano" },
  ];

  return (
    <div className="indeks-page">
      <header className="indeks-hero">
        <h1>Indeks recepata</h1>
        <p>
          Pregledajte sve recepte, podijeljene u slatke i slane kategorije.
          Svaka kategorija skriva posebne gluten-free poslastice.
        </p>
      </header>

      <section className="indeks-grid">
        {categories.map((c) => (
          <Link
            to={`/recipes?category=${c.slug}`}
            key={c.name}
            className="indeks-card"
          >
            <img src={c.image} alt={c.name} />
            <div className="indeks-info">
              <h2>{c.name}</h2>
              <p>{c.type === "slatko" ? "Slatki recepti" : "Slani recepti"}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
