import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="hly-footer">
      <div className="hly-container">
        <div className="hly-footer-grid">

          
          <div className="hly-footer-brand">
            <div className="hly-footer-logo">
              <img src="/loo.png" alt="Akagera Park Inn" />
            </div>
            <p>A memorable stay near Akagera National Park — rooms, comfort, and beautiful experiences in Rwanda.</p>
            <div className="hly-footer-socials">
              <a href="https://www.tiktok.com/@akagera.parkinn" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 448 512" width="15" height="15" fill="currentColor"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
              </a>
              <a href="https://www.facebook.com/share/1DxQEEXv7V/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 320 512" width="15" height="15" fill="currentColor"><path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"/></svg>
              </a>
              <a href="https://www.instagram.com/akageraparkinn" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 448 512" width="15" height="15" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z"/></svg>
              </a>
            </div>
          </div>

          
          <div className="hly-footer-col">
            <h5>Information</h5>
            <ul className="hly-footer-contact">
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <a href="#">Kayonza, Eastern Province, Rwanda</a>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href="mailto:info@akageraparkinn.com">info@akageraparkinn.com</a>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.71-.71a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href="tel:+250788395521">+250 788 395 521</a>
              </li>
            </ul>
          </div>

          
          <div className="hly-footer-col">
            <h5>Quick Links</h5>
            <ul className="hly-footer-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="https://direct-book.com/properties/akageraparkinn?locale=en" target="_blank" rel="noopener noreferrer">Rooms</a></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/experiences">Experiences</Link></li>
              <li><Link to="/offers">Offers</Link></li>
              <li><Link to="/services">Services</Link></li>
            </ul>
          </div>

          
          <div className="hly-footer-col">
            <h5>Subscribe</h5>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>Get updates on offers and events at Akagera Park Inn.</p>
            <div className="hly-subscribe-form">
              <input type="email" placeholder="Email Address" />
              <button type="button" aria-label="Subscribe">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>

        </div>
      </div>

      
      <div className="hly-footer-bottom">
        <div className="hly-container">
          <p>© 2026 Akagera Park Inn — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
