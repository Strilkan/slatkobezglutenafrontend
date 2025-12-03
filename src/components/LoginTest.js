import React, { useState } from "react";
import { API_BASE } from "../api";

export default function LoginTest() {
  const [message, setMessage] = useState("");
  const [recepti, setRecepti] = useState([]);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: "martin.strilic@gmail.com",
          password: "Hrvatska12", // ✔ Password ispravan
        }),
      });

      const data = await res.json();
      console.log("📦 Login odgovor:", data);

      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
        setMessage("✅ Uspješno logiran! Dohvaćam recepte...");

        const receptRes = await fetch(
          `${API_BASE}/api/recepts?populate=*`,
          {
            headers: {
              Authorization: `Bearer ${data.jwt}`,
            },
          }
        );

        const receptData = await receptRes.json();
        console.log("📘 Recepti:", receptData);

        // Strapi v5 → direktna polja
        const arr = Array.isArray(receptData.data)
          ? receptData.data.map((r) => ({
              id: r.id,
              Naslov: r.Naslov,
              KratkiOpis: r.KratkiOpis,
            }))
          : [];

        setRecepti(arr);
        setMessage("🍰 Recepti dohvaćeni!");
      } else {
        setMessage("❌ Neispravni podaci za prijavu.");
      }
    } catch (err) {
      console.error("💥 Greška:", err);
      setMessage("🚫 Nije moguće spojiti se na server.");
    }
  };

  return (
    <div
      style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif" }}
    >
      <h2>🔑 Testni login u Strapi (Render)</h2>

      <button
        onClick={handleLogin}
        style={{
          background: "#caa86f",
          border: "none",
          padding: "10px 20px",
          color: "#fff",
          cursor: "pointer",
          borderRadius: "8px",
        }}
      >
        Prijavi se
      </button>

      <p>{message}</p>

      {recepti.length > 0 && (
        <ul style={{ textAlign: "left", marginTop: "1rem" }}>
          {recepti.map((r) => (
            <li key={r.id}>
              <strong>{r.Naslov}</strong> — {r.KratkiOpis}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
