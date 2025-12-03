import React from "react";
import "../styles/putovanja.css";

import italija from "../assets/images/italija.jpg";
import pariz from "../assets/images/pariz.jpg";
import slovenija from "../assets/images/slovenija.jpg";

export default function Putovanja() {
  const travels = [
    {
      id: 1,
      title: "Bezglutensko putovanje Italijom",
      image: italija,
      excerpt:
        "Otkrijte bezglutenske specijalitete Italije — od rimskih pica do toskanskih deserata bez glutena.",
    },
    {
      id: 2,
      title: "Pariz bez glutena",
      image: pariz,
      excerpt:
        "Kako pronaći savršene croissante bez glutena u srcu Pariza? Vodič kroz najbolje gluten-free bistroe.",
    },
    {
      id: 3,
      title: "Slovenija za ljubitelje bezglutenske kuhinje",
      image: slovenija,
      excerpt:
        "Putovanje po Sloveniji — mala zemlja s velikom gluten-free ponudom i predivnim prirodnim pejzažima.",
    },
  ];

  return (
    <div className="putovanja-page">
      <header className="putovanja-hero">
        <h1>Bezglutenska putovanja</h1>
        <p>
          Inspirirajte se mojim gluten-free putovanjima diljem Europe. Otkrijte
          restorane, kafiće i recepte koji dokazuju da se bez glutena može
          uživati svugdje.
        </p>
      </header>

      <section className="putovanja-grid">
        {travels.map((t) => (
          <article key={t.id} className="putovanje-card">
            <img src={t.image} alt={t.title} />
            <h2>{t.title}</h2>
            <p>{t.excerpt}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
