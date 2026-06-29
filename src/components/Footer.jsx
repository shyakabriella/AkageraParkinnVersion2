import { Link } from './Link';
import { site } from '../data/site';
import { looLogo } from '../lib/assets';
const columns = [
    {
        title: 'Explore',
        links: [
            { label: 'About Us', to: '/about' },
            { label: 'Rooms', to: '/stays' },
            { label: 'Services', to: '/experiences' },
            { label: 'Restaurant', to: '/restaurant' },
            { label: 'Gallery', to: '/gallery' },
        ],
    },
    {
        title: 'Book',
        links: [
            { label: 'Reserve a Room', to: 'https://direct-book.com/properties/akageraparkinn?locale=en&items[0][adults]=2&items[0][children]=0&items[0][infants]=0&currency=USD&checkInDate=2026-06-27&checkOutDate=2026-06-28&trackPage=no' },
            { label: 'View Rooms', to: '/stays' },
            { label: 'Restaurant', to: '/restaurant' },
            { label: 'Guest Reviews', to: '/stories' },
        ],
    },
    {
        title: 'Contact',
        links: [
            { label: site.phones[0], to: '/book' },
            { label: site.phones[1], to: '/book' },
            { label: site.email, to: '/book' },
            { label: site.address, to: '/book' },
            { label: `Check-in ${site.checkIn}`, to: '/book' },
        ],
    },
];
const InstagramIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>);
const socials = [
    { icon: InstagramIcon, href: site.social.instagram, label: 'Instagram' },
];
export default function Footer() {
    return (<footer className="bg-forest-950 text-sand-200/80">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-4">
              <span className="flex items-center justify-center">
                <img src={looLogo} alt="Akagera Park Inn logo" className="h-16 w-auto object-contain"/>
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-semibold text-sand-50">
                  {site.name}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-sand-200/60">
                  {site.subtitle}
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              {site.tagline}. {site.address}.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (<a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex h-10 w-10 items-center justify-center rounded-full border border-sand-50/15 text-sand-200/80 transition-all hover:border-sand-50 hover:bg-sand-50 hover:text-forest-900">
                  <s.icon className="h-4 w-4" strokeWidth={1.5}/>
                </a>))}
              <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center rounded-full border border-sand-50/15 text-sand-200/80 transition-all hover:border-sand-50 hover:bg-sand-50 hover:text-forest-900">
                <span className="text-xs font-bold">TT</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            {columns.map((col) => (<div key={col.title}>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-sand-50">
                  {col.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (<li key={l.label}>
                      <Link to={l.to} className="text-sm text-sand-200/70 transition-colors hover:text-sand-50">
                        {l.label}
                      </Link>
                    </li>))}
                </ul>
              </div>))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-sand-50/10 pt-8 text-xs text-sand-200/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name} — All rights reserved.</p>
          <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-sand-50">
            Book Online
          </a>
        </div>
      </div>
    </footer>);
}
