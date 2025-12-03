import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";
import API, { API_BASE } from "../api";
import { RecipeCardSkeleton } from "./LoadingSkeleton";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/home.css";
import logo from "../assets/images/logo.jpg";

export default function Home() {
  const [recepti, setRecepti] = useState([]);
  const [showSlatko, setShowSlatko] = useState(false);
  const [showSlano, setShowSlano] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    API.get("/recepts?populate=*")
      .then((res) => {
        console.log("📦 API podaci:", res.data.data);
        setRecepti(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Greška kod API-ja:", err);
        setError("Nije moguće učitati recepte. Molimo pokušajte ponovo.");
        setLoading(false);
      });
  }, []);

  // Strapi v5 — direktna polja
  const featured = recepti.filter((r) => r.Istaknuto === true);
  const slatko = recepti.filter((r) => r.Tip === "slatko");
  const slano = recepti.filter((r) => r.Tip === "slano");

  if (error) {
    return (
      <div className="home">
        <div className="error-message">
          <h2>Ups! Nešto je pošlo po zlu</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-accent"
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* LOGO */}
      <div className="home-logo-wrap">
        <img src={logo} alt="Slatko bez glutena logo" className="logo" />
      </div>

      {/* HERO */}
      <header className="hero">
        <h1>Dobrodošli — Slatko bez glutena</h1>
        <p>Bezglutenski recepti s okusom doma.</p>
      </header>

      {/* FEATURED */}
      <section className="featured-slider">
        <h2>Istaknuti recepti</h2>

        {loading ? (
          <div className="grid">
            {[...Array(3)].map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={3}
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={featured.length >= 3} // ⬅ prevents Swiper warning
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {featured.map((r) => (
              <SwiperSlide key={r.id}>
                <RecipeCard
                  recipe={{
                    id: r.id,
                    documentId: r.documentId,
                    title: r.Naslov,
                    description: r.KratkiOpis,
                    image: r.Slika?.[0]?.url
                      ? `${API_BASE}${r.Slika[0].url}`
                      : "/placeholder.jpg",
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="no-recipes">Trenutno nema istaknutih recepata.</p>
        )}
      </section>

      {/* CATEGORY BUTTONS */}
      <section className="category-buttons">
        <button
          className="btn-accent"
          onClick={() => setShowSlatko(!showSlatko)}
        >
          🍰 {showSlatko ? "Sakrij slatke recepte" : "Pogledaj slatke recepte"}
        </button>

        <button
          className="btn-accent-outline"
          onClick={() => setShowSlano(!showSlano)}
        >
          🥖 {showSlano ? "Sakrij slane recepte" : "Pogledaj slane recepte"}
        </button>
      </section>

      {/* SLATKO */}
      {showSlatko && (
        <section className="recipe-section">
          <h2>Slatki recepti 🍰</h2>
          {loading ? (
            <div className="grid">
              {[...Array(6)].map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : slatko.length > 0 ? (
            <div className="grid">
              {slatko.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={{
                    id: r.id,
                    documentId: r.documentId,
                    title: r.Naslov,
                    description: r.KratkiOpis,
                    image: r.Slika?.[0]?.url
                      ? `${API_BASE}${r.Slika[0].url}`
                      : "/placeholder.jpg",
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="no-recipes">Trenutno nema slatkih recepata.</p>
          )}
        </section>
      )}

      {/* SLANO */}
      {showSlano && (
        <section className="recipe-section">
          <h2>Slani recepti 🥖</h2>
          {loading ? (
            <div className="grid">
              {[...Array(6)].map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : slano.length > 0 ? (
            <div className="grid">
              {slano.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={{
                    id: r.id,
                    documentId: r.documentId,
                    title: r.Naslov,
                    description: r.KratkiOpis,
                    image: r.Slika?.[0]?.url
                      ? `${API_BASE}${r.Slika[0].url}`
                      : "/placeholder.jpg",
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="no-recipes">Trenutno nema slanih recepata.</p>
          )}
        </section>
      )}
    </div>
  );
}
