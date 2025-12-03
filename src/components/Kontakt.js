import React, { useState } from "react";
import "../styles/contact.css";

export default function Kontakt() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Za sada samo test poruka (backend možeš povezati kasnije)
    console.log("Poruka poslana:", formData);
    setStatus("Hvala na poruci! Odgovorit ću vam uskoro. 💌");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      <section className="contact-header">
        <h1>Kontakt</h1>
        <p>
          Imaš pitanje, želiš suradnju ili jednostavno podijeliti svoj
          bezglutenski recept? Veselim se tvojoj poruci!
        </p>
      </section>

      <section className="contact-wrapper">
        <div className="contact-form">
          <h2>Pošalji poruku</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Ime i prezime
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              E-mail adresa
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Poruka
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </label>

            <button type="submit">Pošalji</button>
          </form>
          {status && <p className="status-msg">{status}</p>}
        </div>

        <div className="contact-info">
          <h2>Kontakt informacije</h2>
          <p>
            📍 Zagreb, Hrvatska
            <br />
            📧{" "}
            <a href="mailto:info@slatkobezglutena.hr">
              info@slatkobezglutena.hr
            </a>
          </p>

          <div className="social-links">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
          </div>

          <div className="map-container">
            <iframe
              title="Google mapa"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2781.583199394597!2d15.97797941554385!3d45.81501017910679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4765d1ff456f7d5f%3A0x63da517a826ffba4!2sZagreb!5e0!3m2!1shr!2shr!4v1692027198377!5m2!1shr!2shr"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
