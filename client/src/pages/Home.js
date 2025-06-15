// src/pages/Home.js
import '../css/pages.css';
import '../css/responsive.css';

export default function Home() {
  return (
    <div className="page-container">
      <section className="card">
        <h1>Welcome to DataScraper</h1>
        <p>Automatically extract insights from any website in seconds.</p>
        <a href="/signin" className="page-button">Get Started</a>
      </section>

      <section className="features">
        <div className="card">
          <h3>Fast & Reliable</h3>
          <p>Scrape and store website data securely.</p>
        </div>
        <div className="card">
          <h3>Role-Based Dashboards</h3>
          <p>Admins manage users, while users track scrapes.</p>
        </div>
        <div className="card">
          <h3>Custom Exports</h3>
          <p>Export your scraped data as needed.</p>
        </div>
      </section>
    </div>
  );
}
