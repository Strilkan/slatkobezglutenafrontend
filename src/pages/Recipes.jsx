import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { recipes } from '../data/recipes';
import './Recipes.css';

function Recipes() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...new Set(recipes.map(r => r.category))];
  
  const filteredRecipes = selectedCategory === 'All' 
    ? recipes 
    : recipes.filter(r => r.category === selectedCategory);

  return (
    <div className="recipes-page">
      <div className="page-header">
        <h1>All Recipes</h1>
        <p>Browse our collection of {recipes.length} delicious gluten-free recipes</p>
      </div>

      <div className="container">
        <div className="filter-section">
          <label htmlFor="category-filter">Filter by category:</label>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="recipe-grid">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="no-results">
            <p>No recipes found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recipes;
