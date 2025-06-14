// Services.js
import React from 'react';
import '../css/pages.css';

export default function Services() {
  return (
    
    <div className='page-container'>
       <div className="page services">
      <h1>Our Services</h1>
      <ul className="service-list">
        <li>
          <h3>Smart Web Scraping</h3>
          <p>Scrape structured data like titles, links, or entire HTML from public websites.</p>
        </li>
        <li>
          <h3>User Dashboards</h3>
          <p>Track your scraping history, manage account settings, and export results.</p>
        </li>
        <li>
          <h3>Admin Control Panel</h3>
          <p>Manage users, monitor activity, and audit scraped content with full admin tools.</p>
        </li>
        <li>
          <h3>Export & Integration</h3>
          <p>Download scraped data in JSON or CSV format for use in your apps or reports.</p>
        </li>
      </ul>
    </div>
    </div>
  );
}
