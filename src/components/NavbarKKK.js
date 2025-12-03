import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.jpg"; // ✅ provjeri putanju!

import "../styles/navbar.css";

export default function Navbar() {
  return (
    <header className="nav-header">
      <div className="nav-container">
        {/* LOGO */}
        <div className="nav-logo">
          <NavLink to="/">
            <img src={logo} alt="Slatko bez glutena" />
          </NavLink>
        </div>

        {/* LINKS */}
        <nav className="nav-links">
          <NavLink to="/">Početna</NavLink>
          <NavLink to="/recipes">Recepti</NavLink>
          <NavLink to="/putovanja">Putovanja</NavLink>
          <NavLink to="/kontakt">Kontakt</NavLink>
        </nav>
      </div>
    </header>
  );
}
