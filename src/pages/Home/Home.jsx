import React, { useEffect } from 'react';
import { usePageInit } from '../../hooks/usePageInit';

const Home = () => {
  usePageInit();

  useEffect(() => {
    const setupPoolCarousel = () => {
      const prevBtn = document.querySelector('button[aria-label="Previous photo"]');
      const nextBtn = document.querySelector('button[aria-label="Next photo"]');
      const thumbBtns = document.querySelectorAll('button[aria-label^="Open photo"]');
      const counter = document.querySelector('.absolute.top-3.right-3');

      if (!prevBtn || !nextBtn || thumbBtns.length === 0) return;

      const poolImages = Array.from(thumbBtns).map(btn => btn.querySelector('img')?.src).filter(Boolean);
      let poolIdx = 0;

      const mainImgContainer = prevBtn.closest('.relative');
      const mainImg = mainImgContainer?.querySelector('img.absolute, img');

      const updatePool = (idx) => {
        if (mainImg && poolImages[idx]) mainImg.src = poolImages[idx];
        if (counter) counter.textContent = idx + 1 + '/' + poolImages.length;
        thumbBtns.forEach((btn, i) => {
          btn.style.borderColor = i === idx ? 'rgb(17,24,39)' : 'rgb(229,231,235)';
        });
      };

      prevBtn.addEventListener('click', () => { poolIdx = (poolIdx - 1 + poolImages.length) % poolImages.length; updatePool(poolIdx); });
      nextBtn.addEventListener('click', () => { poolIdx = (poolIdx + 1) % poolImages.length; updatePool(poolIdx); });
      thumbBtns.forEach((btn, i) => btn.addEventListener('click', () => { poolIdx = i; updatePool(i); }));
    };

    const setupHeroSlider = () => {
      const slides = document.querySelectorAll('.hly-slide');
      const dots   = document.querySelectorAll('.hly-dot');
      let current  = 0;
      let timer    = null;

      if (!slides.length || !dots.length) return;

      function goTo(n) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
        slides[current].style.animation = 'none';
        void slides[current].offsetHeight; // force reflow
        slides[current].style.animation = '';
      }

      function next() { goTo(current + 1); }

      function startAuto() {
        timer = setInterval(next, 5500);
      }

      function resetAuto() {
        clearInterval(timer);
        startAuto();
      }

      dots.forEach(function(dot, i) {
        dot.addEventListener('click', function() { goTo(i); resetAuto(); });
      });

      startAuto();
      
      return () => clearInterval(timer); // Cleanup on unmount
    };

    setTimeout(setupPoolCarousel, 400);
    const cleanupSlider = setupHeroSlider();
    
    return () => {
      if (cleanupSlider) cleanupSlider();
    };
  }, []);

  return (
    <>
<div className="hly-page">

  
  <section className="hly-banner" id="hly-top">

    
    <div className="hly-slides" id="hlySlides">
      <div className="hly-slide active" style={{ backgroundImage: "url('/img/1.jpg')" }}></div>
      <div className="hly-slide" style={{ backgroundImage: "url('/img/2.jpg')" }}></div>
      <div className="hly-slide" style={{ backgroundImage: "url('/img/3.jpg')" }}></div>
      <div className="hly-slide" style={{ backgroundImage: "url('/img/abt.jpg')" }}></div>
    </div>

    
    <div className="hly-banner-overlay"></div>

    
    <div className="hly-banner-content">
      <span className="hly-banner-subtitle">Boutique Hotel — Akagera, Rwanda</span>
      <h1 className="hly-banner-title">The best way to<br />experience the wild.</h1>
      <div className="hly-banner-actions">
        <a className="theme-btn" href="https://direct-book.com/properties/akageraparkinn?locale=en&items[0][adults]=2&items[0][children]=0&items[0][infants]=0&currency=USD&checkInDate=2026-01-03&checkOutDate=2026-01-04&trackPage=yes" target="_blank" rel="noopener noreferrer">
          Book Now
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </div>

    
    <div className="hly-banner-dots" id="hlyDots">
      <button className="hly-dot active" data-slide="0" aria-label="Slide 1"></button>
      <button className="hly-dot" data-slide="1" aria-label="Slide 2"></button>
      <button className="hly-dot" data-slide="2" aria-label="Slide 3"></button>
      <button className="hly-dot" data-slide="3" aria-label="Slide 4"></button>
    </div>

    
    <div className="hly-scroll-down">
      <a href="#hly-rooms">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        Scroll Down
      </a>
    </div>
  </section>

  
  <section className="hly-section hly-rooms-section" id="hly-rooms">
    <div className="hly-container">
      <div className="hly-section-header">
        <div className="hly-section-header-left">
          <span className="subtitle__one">Deluxe &amp; Comfortable</span>
          <h2>Our Rooms</h2>
        </div>
        <div className="hly-section-header-right">
          <a className="theme-border-btn" href="https://direct-book.com/properties/akageraparkinn?locale=en&items[0][adults]=2&items[0][children]=0&items[0][infants]=0&currency=USD&checkInDate=2026-01-03&checkOutDate=2026-01-04&trackPage=yes" target="_blank" rel="noopener noreferrer">
            All Rooms
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

        
        <div className="hly-room-card">
          <div className="hly-room-img">
            <a href="https://direct-book.com/properties/akageraparkinn?locale=en" target="_blank" rel="noopener noreferrer">
              <img src="https://api.akageraparkinn.com/storage/rooms/229c466c-9159-4a8f-b174-2a6515a4502b.jpeg" alt="Double Room" loading="lazy" />
            </a>
          </div>
          <div className="hly-room-body">

            <h4><a href="https://direct-book.com/properties/akageraparkinn?locale=en" target="_blank" rel="noopener noreferrer">Double Room</a></h4>
            <p>Bright and spacious double room with garden views, private bathroom, and all modern comforts.</p>
            <div className="hly-room-meta">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 12h1v6H3v2h18v-2h-1v-6h1V8H3v4zm3 0h4v6H6v-6zm6 0h4v6h-4v-6zM5 4h14v2H5z"/></svg>
                (1) Bed
              </span>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                Up to 2 Guests
              </span>
            </div>
            <div className="hly-room-footer">
              <a className="hly-read-more" href="https://direct-book.com/properties/akageraparkinn?locale=en" target="_blank" rel="noopener noreferrer">Book Now</a>
              <span className="hly-rating">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#B89146"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                4.9
              </span>
            </div>
          </div>
        </div>

        
        <div className="hly-room-card">
          <div className="hly-room-img">
            <a href="https://direct-book.com/properties/akageraparkinn?locale=en" target="_blank" rel="noopener noreferrer">
              <img src="https://api.akageraparkinn.com/storage/rooms/34223768-6ecf-4741-82e4-41f6301f6adc.jpeg" alt="Twin Room" loading="lazy" />
            </a>
          </div>
          <div className="hly-room-body">

            <h4><a href="https://direct-book.com/properties/akageraparkinn?locale=en" target="_blank" rel="noopener noreferrer">Twin Room</a></h4>
            <p>Comfortable twin room with two separate beds, ideal for colleagues or friends exploring Akagera.</p>
            <div className="hly-room-meta">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 12h1v6H3v2h18v-2h-1v-6h1V8H3v4zm3 0h4v6H6v-6zm6 0h4v6h-4v-6zM5 4h14v2H5z"/></svg>
                (2) Beds
              </span>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                Up to 4 Guests
              </span>
            </div>
            <div className="hly-room-footer">
              <a className="hly-read-more" href="https://direct-book.com/properties/akageraparkinn?locale=en" target="_blank" rel="noopener noreferrer">Book Now</a>
              <span className="hly-rating">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#B89146"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                4.8
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  
  <section className="hly-cta-banner" style={{ backgroundImage: "url('/img/5.jpg')" }}>
    <div className="hly-cta-overlay"></div>
    <div className="hly-container hly-cta-inner">
      <div className="hly-cta-left">
        <h2>Experience nature at its finest</h2>
      </div>
      <div className="hly-cta-right">
        <div className="hly-cta-phone-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.71-.71a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </div>
        <div>
          <span className="hly-cta-label">Call Us Anytime</span>
          <a href="tel:+250788395521" className="hly-cta-phone">+250 788 395 521</a>
        </div>
      </div>
    </div>
  </section>

  
  <section className="hly-section hly-about-section">
    <div className="hly-container">
      <div className="hly-about-grid">

        <div className="hly-about-image">
          <img src="/img/abt.jpg" alt="Akagera Park Inn" loading="lazy" />
        </div>

        <div className="hly-about-content">
          <span className="subtitle__one">About Us</span>
          <h2>A haven of comfort beside the wild</h2>
          <p>Nestled at the gateway to Akagera National Park, Akagera Park Inn is a boutique hotel that blends modern comforts with Rwanda's natural beauty. Each room is thoughtfully designed to provide a peaceful retreat after a day of wildlife adventures.</p>
          <p style={{ marginTop: '1rem' }}>Our facilities include a swimming pool, restaurant, bar, and curated local experiences — all designed to make your stay unforgettable.</p>
          <a className="theme-border-btn" href="https://direct-book.com/properties/akageraparkinn/about?locale=en" target="_blank" rel="noopener noreferrer" style={{ marginTop: '2rem', display: 'inline-flex' }}>
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>

        <div className="hly-about-image-right">
          <img src="/img/p1.jpg" alt="Akagera Pool" loading="lazy" />
          <div className="hly-about-badge">
            <span className="hly-badge-num">5★</span>
            <span className="hly-badge-text">Boutique<br />Experience</span>
          </div>
        </div>

      </div>
    </div>
  </section>

  
  <section className="hly-section hly-services-section" style={{ paddingTop: 0 }}>
    <div className="hly-container">
      <div className="hly-services-grid">

        <div className="hly-service-card">
          <span className="hly-service-num">01</span>
          <div className="hly-service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none" stroke="#B89146" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div className="hly-service-content">
            <h4>Room Cleaning</h4>
            <p>Daily housekeeping and deep cleaning services maintaining the highest standards of comfort.</p>
          </div>
        </div>

        <div className="hly-service-card">
          <span className="hly-service-num">02</span>
          <div className="hly-service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none" stroke="#B89146" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div className="hly-service-content">
            <h4>Airport Transfer</h4>
            <p>Convenient pickup &amp; drop-off service from Kigali International Airport to the hotel.</p>
          </div>
        </div>

        <div className="hly-service-card">
          <span className="hly-service-num">03</span>
          <div className="hly-service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none" stroke="#B89146" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div className="hly-service-content">
            <h4>Swimming Pool</h4>
            <p>Relax in our refreshing outdoor swimming pool with a beautiful view of the surrounding nature.</p>
          </div>
        </div>

        <div className="hly-service-card">
          <span className="hly-service-num">04</span>
          <div className="hly-service-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none" stroke="#B89146" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          </div>
          <div className="hly-service-content">
            <h4>Park Experiences</h4>
            <p>Guided tours, wildlife safaris, and nature experiences in Akagera National Park.</p>
          </div>
        </div>

      </div>
    </div>
  </section>

  
  <section className="hly-booking-section" style={{ backgroundImage: "url('/img/6.jpg')" }}>
    <div className="hly-booking-overlay"></div>
    <div className="hly-container">
      <div className="hly-booking-form-wrap">
        <h3>Find your perfect stay</h3>
        <p>Book directly to get the best rate guaranteed</p>
        <div className="hly-booking-form">
          <div className="hly-booking-field">
            <label>Check In</label>
            <input type="date" id="hly-checkin" />
          </div>
          <div className="hly-booking-field">
            <label>Check Out</label>
            <input type="date" id="hly-checkout" />
          </div>
          <div className="hly-booking-field">
            <label>Room Type</label>
            <select>
              <option value="">Any Room</option>
              <option value="double">Double Room</option>
              <option value="twin">Twin Room</option>
              <option value="suite">Pool View Suite</option>
              <option value="family">Family Room</option>
            </select>
          </div>
          <div className="hly-booking-submit">
            <a className="theme-btn" href="https://direct-book.com/properties/akageraparkinn?locale=en&items[0][adults]=2&items[0][children]=0&items[0][infants]=0&currency=USD&checkInDate=2026-01-03&checkOutDate=2026-01-04&trackPage=yes" target="_blank" rel="noopener noreferrer">
              Check Now
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="hly-section hly-place-section">
    <div className="hly-container">
      <div className="hly-place-grid">
        <div className="hly-place-images">
          <div className="hly-place-img-top">
            <img src="/img/3.jpg" alt="Akagera Park Inn" loading="lazy" />
          </div>
          <div className="hly-place-img-bottom">
            <img src="/img/p3.jpg" alt="Pool at Akagera Park Inn" loading="lazy" />
          </div>
        </div>
        <div className="hly-place-content">
          <span className="subtitle__one">Unique Destination</span>
          <h2>A unique place to rest &amp; explore</h2>
          <p>Set on the edge of Akagera National Park in Eastern Rwanda, our inn is surrounded by savanna, wetlands, and the sounds of wildlife. Wake up to nature and fall asleep under the stars.</p>
          <ul className="hly-place-list">
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#B89146"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              Close to Akagera National Park gate
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#B89146"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              On-site restaurant, bar &amp; swimming pool
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#B89146"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              Local cultural experiences &amp; guided tours
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#B89146"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              2.5 hours from Kigali International Airport
            </li>
          </ul>
          <a className="theme-btn" href="/gallery" style={{ display: 'inline-flex', marginTop: '2rem' }}>
            View Gallery
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>
    </div>
  </section>

  
  <section className="hly-section hly-testimonials" style={{ background: '#F7F7F7' }}>
    <div className="hly-container">
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="subtitle__one">Guest Reviews</span>
        <h2>What our guests say</h2>
      </div>
      <div className="hly-testimonials-grid">

        <div className="hly-testimonial-card">
          <div className="hly-testimonial-quote">❝</div>
          <p>"Beautiful rooms, amazing food, and exceptional hospitality. We loved every moment of our stay at Akagera Park Inn!"</p>
          <div className="hly-testimonial-author">
            <div className="hly-testimonial-avatar">M</div>
            <div>
              <strong>Mark R.</strong>
              <span>Wildlife Enthusiast</span>
            </div>
          </div>
        </div>

        <div className="hly-testimonial-card">
          <div className="hly-testimonial-quote">❝</div>
          <p>"A peaceful escape with stunning views and top-notch service. The pool and restaurant made our trip truly special."</p>
          <div className="hly-testimonial-author">
            <div className="hly-testimonial-avatar">J</div>
            <div>
              <strong>Jeanette M.</strong>
              <span>Family Traveller</span>
            </div>
          </div>
        </div>

        <div className="hly-testimonial-card">
          <div className="hly-testimonial-quote">❝</div>
          <p>"The volcanic stone design and tranquil setting make Akagera Park Inn truly special. We will definitely be back!"</p>
          <div className="hly-testimonial-author">
            <div className="hly-testimonial-avatar">E</div>
            <div>
              <strong>Esther K.</strong>
              <span>Solo Explorer</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  


</div>







    </>
  );
};

export default Home;

