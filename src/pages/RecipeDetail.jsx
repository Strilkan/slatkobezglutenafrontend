import { useParams, Link } from 'react-router-dom';
import { recipes } from '../data/recipes';
import './RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const recipe = recipes.find(r => r.id === parseInt(id));

  if (!recipe) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>Recipe not found</h2>
        <Link to="/recipes" className="back-link">← Back to Recipes</Link>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-hero" style={{ backgroundImage: `url(${recipe.image})` }}>
        <div className="recipe-hero-overlay">
          <div className="container">
            <Link to="/recipes" className="back-link">← Back to Recipes</Link>
            <h1>{recipe.title}</h1>
            <p className="recipe-category">{recipe.category}</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="recipe-overview">
          <div className="recipe-info-grid">
            <div className="info-item">
              <span className="info-label">Prep Time</span>
              <span className="info-value">⏱️ {recipe.prepTime}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Cook Time</span>
              <span className="info-value">🔥 {recipe.cookTime}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Servings</span>
              <span className="info-value">🍽️ {recipe.servings}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Difficulty</span>
              <span className="info-value">📊 {recipe.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="recipe-content-grid">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="recipe-tags-section">
          <h3>Tags</h3>
          <div className="tags-container">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
