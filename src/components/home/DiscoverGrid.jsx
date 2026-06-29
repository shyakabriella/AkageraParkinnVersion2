import { ArrowUpRight } from 'lucide-react';
import { Link } from '../Link';
import { discoverCards } from '../../data/pages';
import { site } from '../../data/site';
export default function DiscoverGrid() {
    return (<section className="bg-forest-950 py-24 text-sand-50 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow !text-sand-300/80 reveal">Discover the Inn</p>
            <h2 className="reveal mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Rooms, dining, and services.
            </h2>
          </div>
          <p className="reveal max-w-sm text-sm leading-relaxed text-sand-200/70">
            Explore everything {site.name} offers — from comfortable rooms and
            included breakfast to restaurant, pool, and laundry.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {discoverCards.map((c, i) => (<Link key={c.to} to={c.to} className="reveal group relative block overflow-hidden rounded-3xl" data-reveal-delay={`${(i % 2) * 120}`}>
              <div className="relative h-80 overflow-hidden">
                <img src={c.image} alt={c.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy"/>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent"/>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-sand-200/80">
                  {c.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-sand-50">
                  {c.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-sand-100/80">
                  {c.blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sand-50">
                  Explore
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"/>
                </span>
              </div>
            </Link>))}
        </div>
      </div>
    </section>);
}
