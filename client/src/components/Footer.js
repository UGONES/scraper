// src/components/Footer.js
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-dark text-light py-4 mt-auto">
    <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
      <p className="mb-2 mb-md-0">&copy; {new Date().getFullYear()} Scraper Inc. All rights reserved.</p>
      <ul className="nav">
        <li className="nav-item"><Link to="/" className="nav-link px-2 text-light">Home</Link></li>
        <li className="nav-item"><Link to="/about" className="nav-link px-2 text-light">About</Link></li>
        <li className="nav-item"><Link to="/services" className="nav-link px-2 text-light">Services</Link></li>
      </ul>
    </div>
  </footer>
);

export default Footer;
