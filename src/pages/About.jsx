import { Leaf, Heart, Sun, Wifi, Car, UtensilsCrossed } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { site } from '../data/site';
import nightView from '../Assets/night view.avif';
import roomTwo from '../Assets/room two.jpeg';
const highlights = [
    {
        icon: UtensilsCrossed,
        title: 'Restaurant & Lounge',
        body: 'African, American, and Argentinian cuisine with vegetarian, dairy-free, and halal options. Full breakfast included with every room.',
    },
    {
        icon: Sun,
        title: 'Outdoor Pool & Garden',
        body: 'Unwind in our outdoor swimming pool with a comfortable poolside sitting area, surrounded by gardens and mountain views.',
    },
    {
        icon: Wifi,
        title: 'Free Wi-Fi & Parking',
        body: 'Complimentary high-speed Wi-Fi throughout the hotel and free self parking for all guests.',
    },
    {
        icon: Car,
        title: 'Airport Shuttle',
        body: 'Arrange a paid 24-hour airport shuttle from Kigali International Airport.',
    },
    {
        icon: Heart,
        title: '24-Hour Reception',
        body: 'Our team is available around the clock for check-in, room service, laundry, and any questions during your stay.',
    },
    {
        icon: Leaf,
        title: 'Book Services Flexibly',
        body: 'Reserve restaurant, bar, or laundry on their own — no room booking required.',
    },
];
export default function About() {
    return (<>
      <PageHeader eyebrow="About Us" title={<>
            Experience local culture,
            <span className="italic text-sand-200"> heritage, and unforgettable moments.</span>
          </>} subtitle={site.description} image={nightView}/>

      <section className="bg-sand-50 bg-grain py-24 sm:py-32">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow reveal">Our Hotel</p>
              <h2 className="reveal mt-5 font-display text-3xl font-medium leading-tight text-forest-950 sm:text-4xl">
                A peaceful  hotel minutes from Akagera National Park.
              </h2>
              <div className="reveal mt-6 space-y-4 text-lg leading-relaxed text-forest-800/85">
                <p>
                  {site.name} is located at {site.address}, in the heart of
                  Akagera Village. We are a short drive from the Akagera
                  National Park South Entrance — making us an ideal base for
                  safari days and restful evenings alike.
                </p>
                <p>
                  Our {site.roomCount} rooms feature handcrafted wooden
                  furniture, private balconies, air conditioning, smart TVs,
                  and complimentary high-speed Wi-Fi. Every room booking
                  includes a full breakfast for registered guests.
                </p>
                <p>
                  Beyond accommodation, we offer a restaurant & lounge, bar,
                  outdoor pool, and laundry service — all
                  bookable with or without a room. Check-in and check-out are
                  from {site.checkIn} to {site.checkOut}, with {site.reception.toLowerCase()}.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="reveal sticky top-28 overflow-hidden rounded-3xl shadow-lift">
                <img src={roomTwo} alt="Akagera Park Inn room" className="h-[420px] w-full object-cover" loading="lazy"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-forest-950 py-24 text-sand-50 sm:py-32">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow !text-sand-300/80 reveal">Location</p>
            <h2 className="reveal mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Close to the park. Easy from Kigali.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
            { label: 'Park entrance', value: site.distances.parkEntrance },
            { label: 'From Kigali', value: site.distances.driveFromKigali },
            { label: 'Airport', value: site.distances.kigaliAirport },
        ].map((item, i) => (<div key={item.label} className="reveal rounded-2xl border border-sand-50/10 bg-forest-900/50 p-6" data-reveal-delay={`${i * 80}`}>
                <span className="text-xs font-semibold uppercase tracking-widest text-sand-300/80">
                  {item.label}
                </span>
                <p className="mt-3 font-display text-lg text-sand-50">{item.value}</p>
              </div>))}
          </div>
        </div>
      </section>

      <section className="bg-sand-50 bg-grain py-24 sm:py-32">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow reveal">Amenities & Services</p>
            <h2 className="reveal mt-5 font-display text-4xl font-medium leading-tight text-forest-950 sm:text-5xl">
              Everything you need for a comfortable stay.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((v, i) => (<div key={v.title} className="reveal group rounded-2xl border border-forest-900/10 bg-white/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-forest-600/40 hover:bg-white hover:shadow-soft" data-reveal-delay={`${(i % 3) * 80}`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-700/10 text-forest-700 transition-colors group-hover:bg-forest-700 group-hover:text-sand-50">
                  <v.icon className="h-5 w-5" strokeWidth={1.5}/>
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-forest-950">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-forest-800/75">{v.body}</p>
              </div>))}
          </div>
        </div>
      </section>

      <section className="bg-forest-800 py-20 text-sand-50">
        <div className="container-x flex flex-col items-center gap-6 text-center">
          <h2 className="reveal max-w-2xl font-display text-3xl font-medium leading-tight sm:text-4xl">
            Ready to book your stay at {site.name}?
          </h2>
          <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-primary reveal">
            Book Your Stay
          </a>
        </div>
      </section>
    </>);
}
