// src/pages/About.js
import React from 'react';
import '../css/pages.css';

export default function About() {
  return (
    <div className="page-container">
      <div className="page">
        <h1>About DataScraper</h1>
        <div className="card">
          <p>
            DataScraper is a modern web scraping platform that lets users automatically gather and analyze website data in real time. 
            Whether you're a researcher, business analyst, or developer, our tool simplifies data collection across the web.
          </p>
        </div>
        <div className="card">
          <p>
            Our mission is to make data accessible and useful to everyone. Built with security, simplicity, and scalability in mind,
            our app ensures a seamless experience for both users and administrators.
          </p>
        </div>
      </div>
    </div>
  );
}
