import { Link } from 'react-router-dom';
import './RecipeCard.css';

function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-description">{recipe.description}</p>
        <div className="recipe-meta">
          <span className="recipe-time">⏱️ {recipe.prepTime}</span>
          <span className="recipe-difficulty">📊 {recipe.difficulty}</span>
        </div>
        <div className="recipe-tags">
          {recipe.tags.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
        <Link to={`/recipe/${recipe.id}`} className="recipe-link">
          View Recipe →
        </Link>
      </div>
    </div>
  );
}

export default RecipeCard;
