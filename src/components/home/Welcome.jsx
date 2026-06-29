import { Leaf, Heart, Compass, Sun } from 'lucide-react';
import { site } from '../../data/site';
import nightView from '../../Assets/night view.avif';
import roomOne from '../../Assets/room one.jpeg';
const pillars = [
    {
        icon: Leaf,
        title: 'Calm stays near the park',
        body: 'Just 2–3 km from Akagera National Park South Entrance — close to the wild, with pool, garden, and quiet comfort waiting when you return.',
    },
    {
        icon: Heart,
        title: 'Warm Rwandan hospitality',
        body: 'Beautiful rooms, amazing food, and exceptional service. Our team makes every guest feel welcome from arrival to checkout.',
    },
    {
        icon: Compass,
        title: 'Services on your terms',
        body: 'Book restaurant, bar, or laundry with or without a room. Combine services however suits your trip.',
    },
    {
        icon: Sun,
        title: 'Pool, garden & breakfast',
        body: 'Start each day with a full included breakfast, then unwind by the outdoor pool or in our tranquil garden and terrace.',
    },
];
export default function Welcome() {
    return (<section className="relative bg-sand-50 bg-grain py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="relative lg:col-span-6">
            <div className="reveal relative overflow-hidden rounded-3xl shadow-lift">
              <img src={nightView} alt="Akagera Park Inn exterior and views" className="h-[460px] w-full object-cover sm:h-[560px]" loading="lazy"/>
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 to-transparent"/>
            </div>
            <div className="reveal absolute -bottom-10 -right-4 hidden w-56 overflow-hidden rounded-2xl border-4 border-sand-50 shadow-lift sm:block" data-reveal-delay="150">
              <img src={roomOne} alt="Twin Room at Akagera Park Inn" className="h-40 w-full object-cover" loading="lazy"/>
            </div>
            <div className="reveal absolute -left-4 top-8 flex items-center gap-3 rounded-2xl bg-forest-900 px-5 py-4 text-sand-50 shadow-lift">
              <span className="font-display text-4xl leading-none">{site.roomCount}</span>
              <span className="text-xs uppercase leading-tight tracking-wider text-sand-200/80">
                Rooms
                <br />
                with breakfast
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="eyebrow reveal">Welcome to {site.name}</p>
            <h2 className="reveal mt-5 font-display text-4xl font-medium leading-tight text-forest-950 sm:text-5xl">
              {site.tagline}
            </h2>
            <p className="reveal mt-6 text-lg leading-relaxed text-forest-800/85">
              {site.description} The volcanic stone designs and tranquil
              setting make Akagera Park Inn a peaceful escape with stunning
              views and top-notch service.
            </p>
            <p className="reveal mt-4 text-base leading-relaxed text-forest-800/70">
              Whether you are exploring Akagera National Park or passing
              through Eastern Rwanda, our {site.roomCount} rooms, restaurant
              & lounge, and outdoor pool give you everything you need for a
              perfect getaway.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {pillars.map((p, i) => (<div key={p.title} className="reveal group rounded-2xl border border-forest-900/10 bg-white/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-forest-600/40 hover:bg-white hover:shadow-soft" data-reveal-delay={`${i * 80}`}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-700/10 text-forest-700 transition-colors group-hover:bg-forest-700 group-hover:text-sand-50">
                    <p.icon className="h-5 w-5" strokeWidth={1.5}/>
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-forest-950">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest-800/75">
                    {p.body}
                  </p>
                </div>))}
            </div>
          </div>
        </div>
      </div>
    </section>);
}
