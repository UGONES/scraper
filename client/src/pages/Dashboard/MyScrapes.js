import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const MyScrapes = () => {
  const [scrapes, setScrapes] = useState([]);

  useEffect(() => {
    axios.get('/data/my-scrapes')
      .then(res => setScrapes(res.data))
      .catch(err => console.error('Failed to fetch scrapes:', err));
  }, []);

  return (
    <div className="container">
      <h2>My Scrapes</h2>
      {scrapes.length > 0 ? (
        <ul className="list-group">
          {scrapes.map(scrape => (
            <li key={scrape._id} className="list-group-item">
              <strong>{scrape.title}</strong> — {scrape.url}
            </li>
          ))}
        </ul>
      ) : (
        <p>No scrapes found.</p>
      )}
    </div>
  );
};

export default MyScrapes;
