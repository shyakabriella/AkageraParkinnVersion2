import React from 'react';
import { usePageInit } from '../../hooks/usePageInit';

const Offers = () => {
  usePageInit();

  return (
    <div className="hly-page">
      {/* Inner Banner */}
      <section className="hly-cta-banner" style={{ backgroundImage: "url('/img/abt.jpg')" }}>
        <div className="hly-cta-overlay"></div>
        <div className="hly-container">
          <div className="hly-cta-inner" style={{ justifyContent: 'center', textAlign: 'center', paddingTop: '150px', paddingBottom: '120px' }}>
            <div className="hly-cta-left">
              <span className="hly-banner-subtitle" style={{ color: '#B89146', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>Specials</span>
              <h1 className="hly-banner-title" style={{ marginBottom: 0 }}>Offers & Packages</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="hly-section">
        <div className="hly-container">
          <div className="hly-section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <span className="hly-banner-subtitle" style={{ color: '#B89146' }}>Exclusive Offers</span>
              <h2 style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', color: '#666667', fontWeight: 400, lineHeight: 1.8 }}>
                Take advantage of our exclusive offers at <strong>Akagera Park Inn</strong> and make your getaway even more enjoyable. From discounted stays to curated experience packages, our special deals give you great value while enjoying the exceptional services and unique activities we offer.
              </h2>
            </div>
          </div>

          <div className="hly-rooms-grid" style={{ gap: '2.5rem' }}>
            
            {/* Offer 1 */}
            <div className="hly-room-card">
              <div className="hly-room-img">
                <img src="/img/ro.jpg" alt="Romantic Escape Package" loading="lazy" />
              </div>
              <div className="hly-room-body">
                <span className="hly-room-price">Valid: Year-round</span>
                <h4>Romantic Escape Package</h4>
                <p>Dinner for two, a bottle of wine, room upgrade, and a couple’s massage for a memorable stay.</p>
                <div className="hly-room-footer" style={{ borderTop: 'none', paddingTop: '0' }}>
                  <a className="hly-read-more" href="https://direct-book.com/properties/akageraparkinn?locale=en" target="_blank" rel="noopener noreferrer">Learn More</a>
                </div>
              </div>
            </div>

            {/* Offer 2 */}
            <div className="hly-room-card">
              <div className="hly-room-img">
                <img src="/img/1.jpg" alt="Stay 3, Pay 2 Offer" loading="lazy" />
              </div>
              <div className="hly-room-body">
                <span className="hly-room-price">Valid: Year-round</span>
                <h4>Stay 3, Pay 2 Offer</h4>
                <p>Enjoy three nights for the price of two and make the most of your time at Akagera Park Inn.</p>
                <div className="hly-room-footer" style={{ borderTop: 'none', paddingTop: '0' }}>
                  <a className="hly-read-more" href="https://direct-book.com/properties/akageraparkinn?locale=en" target="_blank" rel="noopener noreferrer">Learn More</a>
                </div>
              </div>
            </div>

            {/* Offer 3 */}
            <div className="hly-room-card">
              <div className="hly-room-img">
                <img src="/img/we.png" alt="Weekend Getaway Special" loading="lazy" />
              </div>
              <div className="hly-room-body">
                <span className="hly-room-price">Valid: Every weekend</span>
                <h4>Weekend Getaway Special</h4>
                <p>15% off room rates, complimentary breakfast, spa access, and late checkout.</p>
                <div className="hly-room-footer" style={{ borderTop: 'none', paddingTop: '0' }}>
                  <a className="hly-read-more" href="https://direct-book.com/properties/akageraparkinn?locale=en" target="_blank" rel="noopener noreferrer">Learn More</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Offers;
