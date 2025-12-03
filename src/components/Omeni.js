import React from "react";
import "../styles/about.css";
import aboutImg from "../assets/images/about-me.jpg";

export default function Omeni() {
  return (
    <div className="about-page">
      {/* GORNJI KREM / ITALIC BLOK */}
      <section className="about-intro">
        <div className="about-intro-inner">
          <img src={aboutImg} alt="Autorica bloga" />
          <p>
            <em>
              Tko god me poznaje, sa sigurnošću će reći kako sam velika
              ljubiteljica kolača, neovisno da li se radi o izradi ili
              degustiranju istih. Stoga, dobrodošli na Slatko bez glutena –
              mjesto gdje se ljubav prema kuhanju spaja s bezglutenskim načinom
              života. <br />
              <br />
              Zovem se Tamara i živim u Rijeci. Ideja o pisanju bloga došla je
              sasvim spontano. Nakon nekoliko godina fotografiranja jela koje
              sam napravila, dobila sam želju fotografije spojiti s receptom i
              podijeliti sa širom publikom, te ujedno sačuvati neke svoje
              bilješke i dojmove o isprobanim receptima.
            </em>
          </p>
        </div>
      </section>

      {/* BIJELI DIO */}
      <section className="about-content">
        <p>
          Slatki, slani, jednostavni, komplicirani - svi recepti su mi dragi. Od
          samog početka (travanj 2011. godine) neprestano sam učila i
          napredovala kako u kvaliteti fotografija tako i po pitanju recepata.
          Moj prvi blog{" "}
          <strong>
            <a
              href="https://cake-cookie-pie.blogspot.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="about-link"
            >
              What's for dessert?
            </a>
          </strong>,
          
          
          bio je u početku zamišljen kao zbirka deserata, a s vremenom sam
          počela objavljivati i slana jela.
        </p>

        <p>
          Zbog zdravstvenih razloga, od 2017. godine ne jedem gluten. Početak je
          bio izazovan, no s vremenom sam se sprijateljila s bezglutenskim
          brašnom. Na blogu možete pronaći recepte koji ne sadrže gluten, kao i
          klasične recepte u bezglutenskoj verziji. Posebno bih istaknula recept
          za <strong>princes krafne</strong> — nikoga tko ih je probao nije
          ostavio ravnodušnim.
        </p>

        <p>
          Osim recepata, dijelim i svoja iskustva s putovanja — kako isplanirati
          putovanje, što spakirati, gdje pronaći siguran obrok i koji su
          restorani prikladni za bezglutensku prehranu.
        </p>
      </section>
    </div>
  );
}
