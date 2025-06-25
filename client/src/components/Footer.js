import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import '../css/footer.css';
import '../css/responsive.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-logo">
      Scraper Inc.
    </div>

    <nav className="footer-links" aria-label="Footer navigation">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/services">Services</Link>
      <Link to="/contact">Contact</Link>
    </nav>

    <div className="footer-socials" aria-label="Social media links">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <FaFacebookF />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
        <FaTwitter />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <FaInstagram />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <FaLinkedinIn />
      </a>
    </div>

    <div className="footer-bottom">
      &copy; {new Date().getFullYear()} Scraper Inc. All rights reserved.
    </div>
  </footer>
);

export default Footer;
