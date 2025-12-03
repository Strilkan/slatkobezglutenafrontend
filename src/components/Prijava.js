import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
import "../styles/login.css";

export default function Prijava() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("⏳ Prijava u tijeku...");

    try {
      // Strapi v5 uses /auth/local (without /api prefix)
      const res = await fetch(`${API_BASE}/api/auth/local`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      console.log("📦 STRAPI LOGIN ODGOVOR:", data);
      console.log("📦 Status:", res.status);
      console.log("📦 Full response:", { status: res.status, statusText: res.statusText, data });
      
      // Detailed error logging
      if (data.error) {
        console.log("🔍 Error object structure:", {
          error: data.error,
          errorType: typeof data.error,
          errorKeys: Object.keys(data.error || {}),
          errorStringified: JSON.stringify(data.error, null, 2)
        });
      }

      if (!res.ok) {
        // Handle error response - Strapi v5 error format
        let errorMsg = "Neispravni podaci ili korisnik ne postoji.";
        
        if (data.error) {
          // Strapi v5 error format - can be object or string
          if (data.error.message) {
            errorMsg = data.error.message;
          } else if (data.error.status) {
            errorMsg = `Greška ${data.error.status}: ${data.error.message || 'Nepoznata greška'}`;
          } else if (typeof data.error === 'string') {
            errorMsg = data.error;
          } else if (data.error.name) {
            errorMsg = `${data.error.name}: ${data.error.message || 'Nepoznata greška'}`;
          }
          
          // Log full error object for debugging
          console.error("❌ Full error object:", JSON.stringify(data.error, null, 2));
        } else if (data.message) {
          errorMsg = data.message;
        }
        
        console.error("❌ Login error details:", {
          status: res.status,
          error: data.error,
          message: data.message,
          fullData: data
        });
        
        setMsg(`❌ ${errorMsg}`);
        return;
      }

      if (data.jwt) {
        localStorage.setItem("token", data.jwt);
        setToken(data.jwt);
        
        // Provjeri korisnika kroz /api/users/me endpoint da dobijemo punu role informaciju
        try {
          const userRes = await fetch(`${API_BASE}/api/users/me?populate=role`, {
            headers: { Authorization: `Bearer ${data.jwt}` },
          });
          
          if (userRes.ok) {
            const userData = await userRes.json();
            console.log("👤 Full user data with role:", userData);
            
            const roleType = userData.role?.type || userData.role?.name || "N/A";
            console.log("👤 User role type:", roleType);
            
            // Ako korisnik nije u authenticated role-u, upozori
            if (roleType !== "authenticated" && roleType !== "Authenticated") {
              setMsg(`⚠️ Upozorenje: Korisnik je u '${roleType}' role-u. Trebao bi biti u 'Authenticated' role-u. Provjerite u Strapi admin panelu: Settings → Users & Permissions → Users → [Vaš korisnik] → Role = Authenticated`);
              setTimeout(() => {
                navigate("/admin");
              }, 5000);
              return;
            }
          }
        } catch (err) {
          console.warn("⚠️ Could not fetch user role:", err);
        }
        
        setMsg("✅ Uspješna prijava!");

        setTimeout(() => {
          navigate("/admin");
        }, 800);
      } else {
        setMsg("❌ Neispravni podaci ili korisnik ne postoji.");
      }
    } catch (err) {
      console.error("💥 Greška:", err);
      setMsg("🚫 Nije moguće spojiti se na Strapi server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setMsg("👋 Odjavljen si.");
  };

  return (
    <div className="login-page">
      <h1>🔑 Admin prijava</h1>

      {!token ? (
        <form onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Lozinka
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Prijavi se</button>
        </form>
      ) : (
        <div>
          <p>✅ Prijavljen si kao admin</p>
          <button onClick={handleLogout}>Odjava</button>
        </div>
      )}

      {msg && <p className="status">{msg}</p>}
    </div>
  );
}
