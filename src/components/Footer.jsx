import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Gluten-Free Delights. All recipes are gluten-free and delicious!</p>
        <p className="footer-note">Enjoy cooking without gluten 🌾🚫</p>
      </div>
    </footer>
  );
}

export default Footer;
