import { Link } from '../Link';
import { site } from '../../data/site';
import roomOne from '../../Assets/room one.jpeg';
export default function CTABand() {
    return (<section className="relative isolate overflow-hidden bg-forest-800 py-24 text-sand-50 sm:py-32">
      <div className="absolute inset-0">
        <img src={roomOne} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-25" loading="lazy"/>
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-900/80 to-forest-900/40"/>
      </div>
      <div className="container-x relative">
        <div className="max-w-2xl">
          <p className="eyebrow !text-sand-300/80 reveal">Book Your Stay</p>
          <h2 className="reveal mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
            Your peaceful escape
            <span className="italic text-sand-200"> awaits near the park.</span>
          </h2>
          <p className="reveal mt-6 text-lg leading-relaxed text-sand-100/85">
            Pick your room and dates for instant confirmation by email. Every
            room booking includes breakfast for registered guests.
          </p>
          <div className="reveal mt-9 flex flex-col gap-4 sm:flex-row">
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Book Your Stay
            </a>
            <Link to="/experiences" className="btn-ghost">
              View Services
            </Link>
          </div>
        </div>
      </div>
    </section>);
}
