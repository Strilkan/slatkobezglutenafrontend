import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/indeks.css";

export default function Indeks() {
  const [openSlatko, setOpenSlatko] = useState(false);
  const [openSlano, setOpenSlano] = useState(false);

  const slatko = [
    "Biskvit",
    "Torte",
    "Cheesecake",
    "Dizano tijesto",
    "Muffini",
    "Keksi",
    "Pite i savijače",
    "Ostalo",
  ];

  const slano = [
    "Kruh i peciva",
    "Dizano tijesto",
    "Muffini",
    "Slane pite i savijače",
    "Juhe",
    "Ostalo",
  ];

  return (
    <div className="indeks-page">
      <header className="indeks-hero">
        <h1>Indeks recepata</h1>
        <p>Odaberite kategoriju i istražite recepte.</p>
      </header>

      {/* SLATKO */}
      <div className="indeks-section">
        <button
          className="dropdown-btn"
          onClick={() => setOpenSlatko(!openSlatko)}
        >
          🍰 Slatko
        </button>

        {openSlatko && (
          <ul className="dropdown-list">
            {slatko.map((category, i) => (
              <li key={i}>
                <Link to={`/recipes?category=${category.toLowerCase()}`}>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* SLANO */}
      <div className="indeks-section">
        <button
          className="dropdown-btn"
          onClick={() => setOpenSlano(!openSlano)}
        >
          🥖 Slano
        </button>

        {openSlano && (
          <ul className="dropdown-list">
            {slano.map((category, i) => (
              <li key={i}>
                <Link to={`/recipes?category=${category.toLowerCase()}`}>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
