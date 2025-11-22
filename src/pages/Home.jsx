import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { recipes } from '../data/recipes';
import './Home.css';

function Home() {
  // Show only 3 featured recipes on home page
  const featuredRecipes = recipes.slice(0, 3);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Gluten-Free Delights</h1>
          <p className="hero-subtitle">
            Discover delicious recipes that are completely gluten-free!
          </p>
          <p className="hero-description">
            Whether you have celiac disease, gluten sensitivity, or simply choose to avoid gluten,
            our collection of recipes will help you enjoy amazing food without compromise.
          </p>
          <Link to="/recipes" className="cta-button">
            Explore All Recipes
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Recipes</h2>
          <div className="recipe-grid">
            {featuredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <div className="view-all">
            <Link to="/recipes" className="view-all-link">
              View All {recipes.length} Recipes →
            </Link>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🌾</div>
              <h3>100% Gluten-Free</h3>
              <p>All our recipes are carefully crafted to be completely gluten-free</p>
            </div>
            <div className="info-card">
              <div className="info-icon">👨‍🍳</div>
              <h3>Easy to Follow</h3>
              <p>Step-by-step instructions make cooking simple and enjoyable</p>
            </div>
            <div className="info-card">
              <div className="info-icon">😋</div>
              <h3>Delicious Results</h3>
              <p>Taste so good, no one will know they're gluten-free!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
