

// Home.js
import React from 'react';
import '../css/pages.css';

export default function Home() {
  return (
    <div className='page-container'>
      <div className="page home">
        <section className="hero">
          <h1>Welcome to DataScraper</h1>
          <p>Automatically extract insights from any website in seconds.</p>
          <a href="/signin" className="cta-button">Get Started</a>
        </section>
        <section className="features">
          <div>
            <h3>Fast & Reliable</h3>
            <p>Scrape and store website data securely.</p>
          </div>
          <div>
            <h3>Role-Based Dashboards</h3>
            <p>Admins manage users, while users track scrapes.</p>
          </div>
          <div>
            <h3>Custom Exports</h3>
            <p>Export your scraped data as needed.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
