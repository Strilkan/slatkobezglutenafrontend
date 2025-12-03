import React from "react";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* LOGO / NAZIV */}
        <div className="footer-logo">
          <h2>Slatko bez glutena</h2>
          <p>Bezglutenski recepti s okusom doma.</p>
        </div>

 {/* SOCIALS */}
<div className="footer-socials">
  <a
    href="https://www.instagram.com/tamara_whatsfordessert/?ref=badge"
    target="_blank"
    rel="noreferrer"
    className="social insta"
  >
    Instagram
  </a>
  <a
    href="https://www.facebook.com/profile.php?id=100063697717720"
    target="_blank"
    rel="noreferrer"
    className="social fb"
  >
    Facebook
  </a>
</div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Slatko bez glutena — izrada:{" "}
          <a href="https://s3le.com.hr" target="_blank" rel="noreferrer">
            S3LE Web Design
          </a>
        </p>
      </div>
    </footer>
  );
}
