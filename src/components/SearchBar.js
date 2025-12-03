import React, { useState } from "react";
import API from "../api";

export default function SearchBar({ setRecipes }) {
  const [q, setQ] = useState("");
  const submit = (e) => {
    e.preventDefault();
    API.get("/recipes", { params: { q } })
      .then((r) => setRecipes(r.data))
      .catch(() => {});
  };
  return (
    <form onSubmit={submit} className="search-bar">
      <input
        placeholder="Pretraži po imenu ili sastojku"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button>Traži</button>
    </form>
  );
}
