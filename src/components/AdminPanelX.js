import React, { useState, useEffect } from "react";

export default function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [recepti, setRecepti] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    Naslov: "",
    KratkiOpis: "",
    Opis: "",
    Okus: "slatko",
    Istaknuto: false,
  });

  // 🔹 Učitavanje svih recepata
  const fetchRecepti = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:1337/api/recepts?populate=*", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecepti(data.data || []);
    } catch (err) {
      console.error("❌ Greška pri dohvaćanju recepata:", err);
    }
  };

  // 🔹 Dodavanje novog recepta
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Nema tokena! Prijavi se prvo kroz /login-test");
      return;
    }

    try {
      const res = await fetch("http://localhost:1337/api/recepts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: newRecipe }),
      });

      const data = await res.json();
      console.log("📦 Novi recept:", data);
      alert("✅ Recept dodan!");
      fetchRecepti();
    } catch (err) {
      console.error("💥 Greška kod unosa recepta:", err);
    }
  };

  useEffect(() => {
    fetchRecepti();
  }, [token]);

  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2>👩‍🍳 Admin Panel — Dodaj novi recept</h2>

      {/* Forma za unos */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          background: "#faf7f2",
          padding: "1.5rem",
          borderRadius: "8px",
        }}
      >
        <input
          type="text"
          placeholder="Naslov"
          value={newRecipe.Naslov}
          onChange={(e) =>
            setNewRecipe({ ...newRecipe, Naslov: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Kratki opis"
          value={newRecipe.KratkiOpis}
          onChange={(e) =>
            setNewRecipe({ ...newRecipe, KratkiOpis: e.target.value })
          }
        />

        <textarea
          placeholder="Opis recepta"
          value={newRecipe.Opis}
          onChange={(e) => setNewRecipe({ ...newRecipe, Opis: e.target.value })}
          rows={4}
        />

        <select
          value={newRecipe.Okus}
          onChange={(e) => setNewRecipe({ ...newRecipe, Okus: e.target.value })}
        >
          <option value="slatko">Slatko 🍰</option>
          <option value="slano">Slano 🥖</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={newRecipe.Istaknuto}
            onChange={(e) =>
              setNewRecipe({ ...newRecipe, Istaknuto: e.target.checked })
            }
          />{" "}
          Istaknuti recept (prikaz u slideru)
        </label>

        <button
          type="submit"
          style={{
            background: "#d4b07a",
            border: "none",
            padding: "10px",
            color: "white",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          ➕ Dodaj recept
        </button>
      </form>

      {/* Popis recepata */}
      <h3 style={{ marginTop: "2rem" }}>📖 Popis postojećih recepata:</h3>
      <ul>
        {recepti.map((r) => (
          <li key={r.id}>
            <strong>{r.Naslov}</strong> — {r.Okus}
          </li>
        ))}
      </ul>
    </div>
  );
}
