import { usePageInit } from '../../hooks/usePageInit';

const GALLERY_IDS = [
  { id: '229c466c-9159-4a8f-b174-2a6515a4502b', alt: 'Double Room interior at Akagera Park Inn' },
  { id: '0163ebdc-f989-4977-ae96-c3a7f832e1fc', alt: 'Outdoor garden area at Akagera Park Inn' },
  { id: 'e1c51373-3188-4f09-8c32-4b99ac2d829d', alt: 'Comfortable room amenities at Akagera Park Inn' },
  { id: '354db07c-8168-4949-baa2-c4b6a2abc076', alt: 'Scenic view from Akagera Park Inn' },
  { id: 'e0b27903-7b41-4abc-b4c0-97b205ec6223', alt: 'Hotel lounge and common area' },
  { id: '34223768-6ecf-4741-82e4-41f6301f6adc', alt: 'Twin Room with two beds at Akagera Park Inn' },
  { id: '47293052-f069-4985-a837-db1071910b28', alt: 'Poolside relaxation area' },
  { id: '6c8bce7a-c8c8-469e-bbd1-3e063f8cc71d', alt: 'Nature surroundings near Akagera National Park' },
];

const Gallery = () => {
  usePageInit();

  return (
    <div className="hly-page">
      {/* Inner Banner */}
      <section className="hly-cta-banner" style={{ backgroundImage: "url('/img/abt.jpg')" }}>
        <div className="hly-cta-overlay"></div>
        <div className="hly-container">
          <div className="hly-cta-inner" style={{ justifyContent: 'center', textAlign: 'center', paddingTop: '150px', paddingBottom: '120px' }}>
            <div className="hly-cta-left">
              <span className="hly-banner-subtitle" style={{ color: '#B89146', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>Photos &amp; Videos</span>
              <h1 className="hly-banner-title" style={{ marginBottom: 0 }}>Gallery</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="hly-section">
        <div className="hly-container">
          <div className="hly-section-header" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '3rem' }}>
            <div>
              <span className="hly-banner-subtitle" style={{ color: '#B89146' }}>Photo Moments</span>
              {/* Fix: was h2 — descriptive intro text should be a <p> */}
              <p className="hly-section-intro">
                A glimpse into the serene beauty, comfortable rooms, and unforgettable experiences at Akagera Park Inn.
              </p>
            </div>
          </div>

          <div className="hly-rooms-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '6rem' }}>
            {GALLERY_IDS.map(({ id, alt }, index) => (
              <div className="hly-room-card" key={index} style={{ border: 'none' }}>
                <div className="hly-room-img" style={{ height: '300px' }}>
                  <img
                    src={`https://api.akageraparkinn.com/storage/rooms/${id}.jpeg`}
                    alt={alt}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="hly-section-header" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '3rem' }}>
            <div>
              <span className="hly-banner-subtitle" style={{ color: '#B89146' }}>Video Highlights</span>
              {/* Fix: was h2 — descriptive intro text should be a <p> */}
              <p className="hly-section-intro">
                Short clips that capture the mood of Akagera Park Inn.
              </p>
            </div>
          </div>

          <div className="hly-rooms-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            {/* Video 1 */}
            <div className="hly-room-card" style={{ border: 'none' }}>
              <div className="hly-room-img" style={{ height: '320px', background: '#000' }}>
                <video controls poster="/img/romantic.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} aria-label="Evening Bonfire and Stargazing video">
                  <source src="https://akageraparkinn.com/video/bonfire.mp4" type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>
              <div className="hly-room-body" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <h4>Evening Bonfire &amp; Stargazing</h4>
              </div>
            </div>

            {/* Video 2 */}
            <div className="hly-room-card" style={{ border: 'none' }}>
              <div className="hly-room-img" style={{ height: '320px', background: '#000' }}>
                <video controls poster="/img/Akagera.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} aria-label="Cultural Experiences video">
                  <source src="https://akageraparkinn.com/video/cultural-experience.mp4" type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>
              <div className="hly-room-body" style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <h4>Cultural Experiences</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
