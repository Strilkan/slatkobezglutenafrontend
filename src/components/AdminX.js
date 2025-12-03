import React, { useState, useEffect } from "react";
import API from "../api";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({
    title: "Lorem ipsum",
    category: "keksi",
    ingredients: ["2"],
    instructions: "<p>Lorem ipsum</p>",
    featured: false,
  });

  useEffect(() => {
    load();
  }, []);
  function load() {
    API.get("/recipes")
      .then((r) => setRecipes(r.data))
      .catch(() => {});
  }

  function saveRecipe(e) {
    e.preventDefault();
    API.post("/recipes", form)
      .then(() => {
        load();
        alert("Spremljeno");
      })
      .catch(() => alert("greska"));
  }

  function loginDemo() {
    API.post("/auth/login", {
      email: "admin@example.com",
      password: "password",
    })
      .then((r) => {
        localStorage.setItem("token", r.data.token);
        setToken(r.data.token);
      })
      .catch(() => alert("login fail"));
  }

  return (
    <div className="admin-page">
      <h1>Admin</h1>
      {!token && (
        <div>
          <button onClick={loginDemo}>Demo login</button>
        </div>
      )}
      <section>
        <h2>Dodaj recept (Lorem ipsum primjer)</h2>
        <form onSubmit={saveRecipe}>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="keksi">Keksi</option>
            <option value="torte">Torte</option>
            <option value="pite">Pite</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />{" "}
            Istaknuto
          </label>
          <button type="submit">Spremi</button>
        </form>
      </section>

      <section>
        <h2>Svi recepti</h2>
        <div className="grid">
          {recipes.map((r) => (
            <div key={r._id}>
              {r.title} — {r.category}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
