import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/recipecard.css";
import fallbackImage from "../assets/images/torta.jpg"; // fallback slika

export default function RecipeCard({ recipe }) {
  const [imageError, setImageError] = useState(false);
  const title = recipe.title || "Bez naslova";
  const description =
    recipe.description || "Bezglutenski recept. Kliknite za detalje.";
  const image = imageError ? fallbackImage : (recipe.image || fallbackImage);

  return (
    <article className="recipe-card">
      <Link to={`/recipes/${recipe.documentId || recipe.id}`} aria-label={`Pogledaj recept: ${title}`}>
        <div className="thumb">
          <img 
            src={image} 
            alt={title} 
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>

        <h3>{title}</h3>

        <p className="excerpt">{description}</p>
      </Link>
    </article>
  );
}
