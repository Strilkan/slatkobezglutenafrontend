// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import API from "../api";

// export default function RecipeDetail() {
//   const { id } = useParams();
//   const [r, setR] = useState(null);
//   useEffect(() => {
//     if (id)
//       API.get(`/recipes/${id}`)
//         .then((res) => setR(res.data))
//         .catch(() => {});
//   }, [id]);
//   if (!r) return <p>Učitavanje...</p>;
//   return (
//     <div className="recipe-detail">
//       <h1>{r.title}</h1>
//       <div className="meta">
//         Kategorija: {r.category} | Autor: {r.authorName || "Admin"}
//       </div>
//       <img
//         src={r.images?.[0] || "/placeholder.jpg"}
//         alt=""
//         style={{ maxWidth: 480, width: "100%" }}
//       />
//       <h2>Sastojci</h2>
//       <ul>
//         {r.ingredients.map((i, idx) => (
//           <li key={idx}>{i}</li>
//         ))}
//       </ul>
//       <h2>Priprema</h2>
//       <div dangerouslySetInnerHTML={{ __html: r.instructions }} />
//       <div className="share">
//         <button onClick={() => window.print()}>Printaj</button>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/recipedetail.css";
import torta from "../assets/images/torta.jpg";
import pita from "../assets/images/pita.jpg";
import kruh from "../assets/images/kruh.jpg";

// Dummy data dok backend ne postoji
const allRecipes = [
  {
    _id: "s1",
    title: "Bezglutenska torta od čokolade",
    description:
      "Sočna torta od tamne čokolade i bademovog brašna, savršena za svaku prigodu.",
    image: torta,
    ingredients: [
      "200 g tamne čokolade (70%)",
      "3 jaja",
      "100 g bademovog brašna",
      "50 g šećera",
      "1 žličica praška za pecivo bez glutena",
    ],
    instructions: [
      "Otopi čokoladu na pari i pusti da se malo ohladi.",
      "U drugoj posudi izmiksaj jaja i šećer dok ne postanu pjenasti.",
      "Dodaj otopljenu čokoladu i bademovo brašno, lagano umiješaj.",
      "Ulij smjesu u kalup i peci na 180°C oko 25 minuta.",
      "Pusti da se ohladi i pospi kakaom prije posluživanja.",
    ],
    category: "slatko",
  },
  {
    _id: "s2",
    title: "Pita od jabuka s cimetom",
    description:
      "Mirisna, domaća pita s jabukama i cimetom — bez trunke glutena.",
    image: pita,
    ingredients: [
      "300 g bezglutenskog brašna",
      "150 g maslaca",
      "3 jabuke",
      "2 žlice šećera",
      "1 žličica cimeta",
    ],
    instructions: [
      "Pomiješaj brašno i maslac dok ne dobiješ mrvičastu smjesu.",
      "Dodaj malo vode i formiraj tijesto, zatim ga razvaljaj.",
      "Nadjev napravi od naribanih jabuka, šećera i cimeta.",
      "Pecite 30 minuta na 180°C dok pita ne dobije zlatnu boju.",
    ],
    category: "slatko",
  },
  {
    _id: "s3",
    title: "Kruh od heljde bez glutena",
    description: "Zdrav, gust i mirisan domaći kruh bez glutena.",
    image: kruh,
    ingredients: [
      "250 g heljdinog brašna",
      "1 vrećica suhog kvasca",
      "300 ml tople vode",
      "1 žličica soli",
      "1 žlica maslinovog ulja",
    ],
    instructions: [
      "Pomiješaj brašno, kvasac i sol.",
      "Dodaj vodu i ulje, promiješaj dok ne dobiješ homogenu smjesu.",
      "Ulij u kalup i ostavi da se diže 30 minuta.",
      "Peci na 200°C oko 40 minuta dok ne porumeni.",
    ],
    category: "slano",
  },
];

export default function RecipeDetail() {
  const { id } = useParams();
  const recipe = allRecipes.find((r) => r._id === id);

  if (!recipe) {
    return (
      <div className="recipe-detail not-found">
        <h2>Recept nije pronađen 😔</h2>
        <Link to="/recipes" className="btn-accent">
          Povratak na recepte
        </Link>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <div className="hero-image">
        <img src={recipe.image} alt={recipe.title} />
      </div>

      <div className="content">
        <h1>{recipe.title}</h1>
        <p className="description">{recipe.description}</p>
        <p className="category">
          Kategorija: <span>{recipe.category}</span>
        </p>

        <div className="columns">
          <div className="ingredients">
            <h2>Sastojci</h2>
            <ul>
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="instructions">
            <h2>Priprema</h2>
            <ol>
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <Link to="/recipes" className="back-btn">
          ← Natrag na recepte
        </Link>
      </div>
    </div>
  );
}
