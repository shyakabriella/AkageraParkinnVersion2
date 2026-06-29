import { useState, useEffect } from 'react';
import { ArrowDown, MapPin } from 'lucide-react';
import { Link } from './Link';
import { site } from '../data/site';
import img1 from '../Assets/p1.jpg';
import img2 from '../Assets/p3.jpg';
import img3 from '../Assets/p4.jpg';
import img4 from '../Assets/night view.avif';

const heroImages = [img1, img2, img3, img4];

export default function Hero() {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % heroImages.length);
      }, 6000); // Change image every 6 seconds
      return () => clearInterval(timer);
    }, []);

    return (<section id="top" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100 animate-slow-zoom" : "opacity-0"
            }`}
            style={{
                backgroundImage: `url('${img}')`,
            }}
          />
        ))}
        {/* Dark overlays to ensure text readability */}
        <div className="absolute inset-0 bg-forest-950/30 z-10"/>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/90 via-forest-950/50 to-forest-950/90 z-10"/>
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/80 to-transparent z-10"/>
      </div>

      <div className="container-x relative z-20 flex min-h-screen flex-col justify-end pb-20 pt-32 sm:pb-28">
        <div className="max-w-3xl">
          <p className="eyebrow animate-fade-in-up text-sand-200/90 opacity-0" style={{ animationDelay: '0.1s' }}>
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5"/> {site.address}
            </span>
          </p>

          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] text-sand-50 opacity-0 animate-fade-in-up sm:text-6xl lg:text-7xl" style={{ animationDelay: '0.25s' }}>
            Welcome back to
            <br />
            <span className="italic text-sand-200">{site.name}.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-sand-100/85 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            {site.tagline}. Experience local culture, heritage, and
            unforgettable moments at our  hotel minutes from Akagera
            National Park.
          </p>

          <div className="mt-10 flex flex-col gap-4 opacity-0 animate-fade-in-up sm:flex-row sm:items-center" style={{ animationDelay: '0.65s' }}>
            <a href={site.bookingUrl} className="btn-primary" target="_blank" rel="noopener noreferrer">
              Book Your Stay
            </a>
            <Link to="/stays" className="btn-ghost">
              View Rooms
            </Link>
          </div>
        </div>

        
      </div>


    </section>);
}
