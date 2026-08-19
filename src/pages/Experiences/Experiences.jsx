import { usePageInit } from '../../hooks/usePageInit';

const Experiences = () => {
  usePageInit();

  return (
    <div className="hly-page">
      {/* Inner Banner */}
      <section className="hly-cta-banner" style={{ backgroundImage: "url('/img/abt.jpg')" }}>
        <div className="hly-cta-overlay"></div>
        <div className="hly-container">
          <div className="hly-cta-inner" style={{ justifyContent: 'center', textAlign: 'center', paddingTop: '150px', paddingBottom: '120px' }}>
            <div className="hly-cta-left">
              <span className="hly-banner-subtitle" style={{ color: '#B89146', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>Activities</span>
              <h1 className="hly-banner-title" style={{ marginBottom: 0 }}>Experiences</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="hly-section">
        <div className="hly-container">
          <div className="hly-section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <span className="hly-banner-subtitle" style={{ color: '#B89146' }}>Akagera Activities &amp; Entertainment</span>
              {/* Fix: was incorrectly an h2 — this is descriptive body text, not a heading */}
              <p className="hly-section-intro">
                From peaceful mornings surrounded by nature to lively evenings by the fire, Akagera Park Inn offers a variety of experiences that blend culture, relaxation, and adventure. Explore some of our signature activities below.
              </p>
            </div>
          </div>

          <div className="hly-rooms-grid" style={{ gap: '2.5rem' }}>

            {/* Experience 1 */}
            <div className="hly-room-card">
              <div className="hly-room-img">
                <img src="/img/cv.jpg" alt="Local cultural walk and village visit" loading="lazy" />
              </div>
              <div className="hly-room-body">
                <span className="hly-room-price">Start: 07:00 • Every Sunday</span>
                <h4>Cultural Experiences</h4>
                <p>Discover local traditions through guided cultural walks, village visits, and storytelling sessions that connect you with the heart of Musanze.</p>
              </div>
            </div>

            {/* Experience 2 */}
            <div className="hly-room-card">
              <div className="hly-room-img">
                <img src="/img/ebs.jpg" alt="Evening bonfire and stargazing under clear skies" loading="lazy" />
              </div>
              <div className="hly-room-body">
                <span className="hly-room-price">Start: 18:00 • Every Day</span>
                <h4>Evening Bonfire &amp; Stargazing</h4>
                <p>Relax by the bonfire under clear volcanic skies, enjoy music and good company, and soak in the peaceful night ambience.</p>
              </div>
            </div>

            {/* Experience 3 */}
            <div className="hly-room-card">
              <div className="hly-room-img">
                <img src="/img/fga.jpg" alt="Nature trail through lush greenery" loading="lazy" />
              </div>
              <div className="hly-room-body">
                <span className="hly-room-price">Morning &amp; Afternoon • Daily</span>
                <h4>Nature Trails &amp; Scenic Walks</h4>
                <p>Stroll through lush greenery and scenic viewpoints around the Hotel, with gentle guided walks suitable for all ages.</p>
              </div>
            </div>

            {/* Experience 4 */}
            <div className="hly-room-card">
              <div className="hly-room-img">
                <img src="/img/NTSW.jpg" alt="Family group activity session" loading="lazy" />
              </div>
              <div className="hly-room-body">
                <span className="hly-room-price">Custom Schedules • On Request</span>
                <h4>Family &amp; Group Activities</h4>
                <p>From small celebrations to team-building moments, we create tailored activities that bring families and friends together.</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Experiences;
