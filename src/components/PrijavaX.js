import React, { useState } from "react";
import "../styles/login.css";

export default function Prijava() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // za sada samo simulacija — kasnije ćemo dodati pravi backend login
    if (
      form.email === "admin@slatkobezglutena.hr" &&
      form.password === "12345"
    ) {
      setMsg("Uspješna prijava ✅");
    } else {
      setMsg("Neispravni podaci ❌");
    }
  };

  return (
    <div className="login-page">
      <h1>Admin prijava</h1>
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
      {msg && <p className="status">{msg}</p>}
    </div>
  );
}
