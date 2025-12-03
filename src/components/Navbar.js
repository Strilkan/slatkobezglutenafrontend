import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/images/logo.jpg"; // ✅ import your logo

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="nav">
      <div className="nav-inner">
        {/* ✅ LOGO + SITE TITLE */}
        <Link to="/" className="logo-wrap" onClick={closeMenu}>
          <img src={logo} alt="Slatko bez glutena logo" className="nav-logo" />
          <h1 className="logo-text">Slatko bez glutena</h1>
        </Link>

        {/* BURGER */}
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}
          aria-expanded={menuOpen}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* LINKS */}
        <nav className={`links ${menuOpen ? "active" : ""}`} role="navigation" aria-label="Glavna navigacija">
          <Link to="/" onClick={closeMenu} aria-label="Naslovna stranica">
            Naslovna
          </Link>
          <Link to="/o-meni" onClick={closeMenu} aria-label="O meni">
            O meni
          </Link>
          <Link to="/indeks" onClick={closeMenu} aria-label="Indeks recepata">
            Indeks recepata
          </Link>
          <Link to="/putovanja" onClick={closeMenu} aria-label="Putovanja">
            Putovanja
          </Link>

          <Link to="/kontakt" onClick={closeMenu} aria-label="Kontakt">
            Kontakt
          </Link>
          <Link to="/prijava" onClick={closeMenu} className="admin-link" aria-label="Admin prijava">
            Admin prijava
          </Link>
        </nav>
      </div>
    </nav>
  );
}
