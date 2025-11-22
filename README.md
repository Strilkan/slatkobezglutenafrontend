# Gluten-Free Delights

A beautiful, modern website for discovering and sharing delicious gluten-free recipes. Built with React and Vite.

## 🌟 Features

- **Recipe Collection**: Browse through a curated collection of gluten-free recipes
- **Recipe Categories**: Filter recipes by category (Dessert, Breakfast, Bread, Main Course)
- **Detailed Recipe Pages**: Each recipe includes:
  - Ingredients list
  - Step-by-step instructions
  - Prep time and cook time
  - Servings and difficulty level
  - Beautiful images
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, attractive interface with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Strilkan/slatkobezglutenafrontend.git
cd slatkobezglutenafrontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```
src/
├── components/       # Reusable components (Header, Footer, RecipeCard)
├── pages/           # Page components (Home, Recipes, RecipeDetail, About)
├── data/            # Recipe data
├── App.jsx          # Main App component with routing
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## 🍰 Recipe Categories

- **Desserts**: Cookies, brownies, and sweet treats
- **Breakfast**: Pancakes, muffins, and banana bread
- **Bread**: Pizza dough and bread recipes
- **Main Course**: Savory dishes

## 🎨 Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS3** - Styling with modern CSS features

## 📝 Adding New Recipes

To add new recipes, edit the `src/data/recipes.js` file and add a new recipe object following the existing format:

```javascript
{
  id: 7,
  title: "Your Recipe Name",
  description: "A brief description",
  image: "image-url",
  prepTime: "15 minutes",
  cookTime: "30 minutes",
  servings: 4,
  difficulty: "Easy",
  ingredients: [...],
  instructions: [...],
  category: "Category Name",
  tags: ["tag1", "tag2"]
}
```

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is open source and available for personal and commercial use.

## 🌾 About Gluten-Free

This website is dedicated to providing delicious recipes for people with celiac disease, gluten sensitivity, or those who choose to follow a gluten-free lifestyle. All recipes are carefully crafted to be 100% gluten-free while maintaining great taste and texture.

---

Enjoy cooking without gluten! 🍰🚫🌾
