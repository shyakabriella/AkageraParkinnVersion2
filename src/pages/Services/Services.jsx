import { usePageInit } from '../../hooks/usePageInit';

const Services = () => {
  usePageInit();

  return (
    <div className="hly-page">
      {/* Inner Banner */}
      <section className="hly-cta-banner" style={{ backgroundImage: "url('/img/abt.jpg')" }}>
        <div className="hly-cta-overlay"></div>
        <div className="hly-container">
          <div className="hly-cta-inner" style={{ justifyContent: 'center', textAlign: 'center', paddingTop: '150px', paddingBottom: '120px' }}>
            <div className="hly-cta-left">
              <span className="hly-banner-subtitle" style={{ color: '#B89146', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>Amenities</span>
              <h1 className="hly-banner-title" style={{ marginBottom: 0 }}>Our Services</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="hly-section">
        <div className="hly-container">
          <div className="hly-section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <span className="hly-banner-subtitle" style={{ color: '#B89146' }}>Explore Our Services</span>
              {/* Fix: was h2 — descriptive intro text should be a <p> */}
              <p className="hly-section-intro">
                At Akagera Park Inn, we&apos;re committed to creating an experience that goes beyond the ordinary. From luxurious accommodations and exceptional dining to unique cultural activities and relaxing wellness options, each service is crafted to make your stay unforgettable.
              </p>
            </div>
          </div>

          <div className="hly-rooms-grid" style={{ gap: '2.5rem' }}>

            {/* Service 1 */}
            <div className="hly-room-card">
              <div className="hly-room-img">
                <img src="/img/camp.jpg" alt="Camping setup with bonfire at Akagera Park Inn" loading="lazy" />
              </div>
              <div className="hly-room-body">
                <h4>Camping Services</h4>
                <p>Enjoy cozy campfire nights, private outdoor lounges, and tailor-made camping setups.</p>
                <div className="hly-room-footer" style={{ borderTop: 'none', paddingTop: '0' }}>
                  <a className="hly-read-more" href="https://direct-book.com/properties/akageraparkinn?locale=en" target="_blank" rel="noopener noreferrer">Learn More</a>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="hly-room-card">
              <div className="hly-room-img">
                <img src="/img/guide.jpg" alt="Expert local tour guide leading group exploration" loading="lazy" />
              </div>
              <div className="hly-room-body">
                <h4>Tour Guiding Services</h4>
                <p>Explore the best of the region with expert local guides – from cultural experiences to scenic viewpoints and nature walks.</p>
                <div className="hly-room-footer" style={{ borderTop: 'none', paddingTop: '0' }}>
                  <a className="hly-read-more" href="https://direct-book.com/properties/akageraparkinn?locale=en" target="_blank" rel="noopener noreferrer">Learn More</a>
                </div>
              </div>
            </div>

            {/* Service 3 */}
            <div className="hly-room-card">
              <div className="hly-room-img">
                <img src="/img/hik.jpg" alt="Guided hike along forest trails near Akagera" loading="lazy" />
              </div>
              <div className="hly-room-body">
                <h4>Hiking Adventures</h4>
                <p>Follow lush forest trails and ridge-top paths with our guided hikes, suitable for both relaxed walkers and adventure seekers.</p>
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

export default Services;
