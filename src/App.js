import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Recipes from "./components/Recipes";
import RecipeDetail from "./components/RecipeDetail";
import Footer from "./components/Footer";
import Omeni from "./components/Omeni";
import Prijava from "./components/Prijava";
import Kontakt from "./components/Kontakt";
import Putovanja from "./components/Putovanja";
import Indeks from "./components/Indeks";
import LoginTest from "./components/LoginTest";
import AdminPanel from "./components/AdminPanel"; // ✅ koristimo novi admin panel
import Category from "./components/Category";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

export default function App() {
  return (
    <ErrorBoundary>
      <div className="app-root">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/putovanja" element={<Putovanja />} />
            <Route path="/indeks" element={<Indeks />} />
            <Route path="/o-meni" element={<Omeni />} />

            {/* ✅ RECEPTI — indeks po kategorijama */}
            <Route path="/recipes" element={<Category />} />

            {/* ✅ SINGLE RECIPE */}
            <Route path="/recipes/:id" element={<RecipeDetail />} />

            {/* ✅ NOVI ADMIN PANEL */}
            <Route path="/admin/*" element={<AdminPanel />} />

            <Route path="/prijava" element={<Prijava />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/login-test" element={<LoginTest />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
