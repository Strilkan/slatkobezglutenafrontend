import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard";

// 👉 Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/home.css";
import image1 from "../assets/images/torta.jpg";
import image2 from "../assets/images/keksi.jpg";
import image3 from "../assets/images/pita.jpg";
import image4 from "../assets/images/focaccia.jpg";
import image5 from "../assets/images/palacinke.jpg";
import image6 from "../assets/images/kruh.jpg";
import image7 from "../assets/images/brownie.jpg";

export default function Home() {
  const [showSlatko, setShowSlatko] = useState(false);
  const [showSlano, setShowSlano] = useState(false);

  // ✅ Dummy podaci
  const dummyRecipes = [
    // --- SLATKI ---
    {
      _id: "s1",
      title: "Bezglutenska torta od čokolade",
      description: "Sočna torta od tamne čokolade i bademovog brašna.",
      image: image1,
      type: "slatko",
    },
    {
      _id: "s2",
      title: "Keksi s bademima bez glutena",
      description: "Hrskavi keksi savršeni uz kavu ili čaj.",
      image: image2,
      type: "slatko",
    },
    {
      _id: "s3",
      title: "Pita od jabuka s cimetom",
      description: "Mirisna pita s jabukama i cimetom bez trunke glutena.",
      image: image3,
      type: "slatko",
    },
    {
      _id: "s4",
      title: "Bezglutenski brownie",
      description: "Čokoladni kolač koji se topi u ustima — bez brašna!",
      image: image5,
      type: "slatko",
    },
    {
      _id: "s5",
      title: "Kolač s limunom i makom",
      description: "Osvježavajući desert s notom citrusa i hrskavim makom.",
      image: image6,
      type: "slatko",
    },
    {
      _id: "s6",
      title: "Palačinke bez glutena s borovnicama",
      description: "Mekane, mirisne i savršene za doručak.",
      image: image7,
      type: "slatko",
    },

    // --- SLANI ---
    {
      _id: "l1",
      title: "Bezglutenska focaccia s ružmarinom",
      description: "Mekana i mirisna focaccia s maslinovim uljem i ružmarinom.",
      image: image4,
      type: "slano",
    },
    {
      _id: "l2",
      title: "Povrtne palačinke bez glutena",
      description: "Tikvice, mrkva i kukuruzno brašno u hrskavom zalogaju.",
      image: image5,
      type: "slano",
    },
    {
      _id: "l3",
      title: "Kruh od heljde bez glutena",
      description: "Zdrav, gust i mirisan domaći kruh bez glutena.",
      image: image6,
      type: "slano",
    },
  ];

  const featured = dummyRecipes.slice(0, 3);

  return (
    <div className="home">
      {/* HERO */}
      <header className="hero">
        <h1>Dobrodošli — Slatko bez glutena</h1>
        <p>
          Bezglutenski recepti s okusom doma. Sezonski, jednostavni i puni
          ljubavi.
        </p>
      </header>

      {/* FEATURED SLIDER */}
      <section className="featured-slider">
        <h2>Istaknuti recepti</h2>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={6}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {featured.map((r) => (
            <SwiperSlide key={r._id}>
              <RecipeCard recipe={r} />
            </SwiperSlide>
          ))}
        </Swiper>
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

      {/* SLATKI RECEPTI */}
      {showSlatko && (
        <section className="recipe-section">
          <h2>Slatki recepti 🍰</h2>
          <div className="grid">
            {dummyRecipes
              .filter((r) => r.type === "slatko")
              .map((r) => (
                <RecipeCard key={r._id} recipe={r} />
              ))}
          </div>
        </section>
      )}

      {/* SLANI RECEPTI */}
      {showSlano && (
        <section className="recipe-section">
          <h2>Slani recepti 🥖</h2>
          <div className="grid">
            {dummyRecipes
              .filter((r) => r.type === "slano")
              .map((r) => (
                <RecipeCard key={r._id} recipe={r} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
