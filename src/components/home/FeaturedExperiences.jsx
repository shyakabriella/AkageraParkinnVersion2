import { ArrowUpRight } from 'lucide-react';
import { Link } from '../Link';
import { experiences } from '../../data/experiences';
export default function FeaturedExperiences() {
    const featured = experiences.slice(0, 3);
    return (<section className="bg-forest-900 py-24 text-sand-50 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow !text-sand-300/80 reveal">Services</p>
            <h2 className="reveal mt-5 font-display text-4xl font-medium leading-tight sm:text-5xl">
              Restaurant, pool, laundry
              <span className="italic text-sand-200"> and more.</span>
            </h2>
          </div>
          <Link to="/experiences" className="reveal group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-sand-50 hover:text-sand-200">
            All services
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/>
          </Link>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {featured.map((e, i) => (<Link key={e.slug} to={`/experiences/${e.slug}`} className="reveal group relative overflow-hidden rounded-3xl" data-reveal-delay={`${i * 120}`}>
              <div className="relative h-80 overflow-hidden">
                <img src={e.image} alt={e.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy"/>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent"/>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="rounded-full bg-sand-50/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sand-50 backdrop-blur-sm w-fit">
                  {e.duration} · {e.when}
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold text-sand-50">
                  {e.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sand-100/80">{e.body}</p>
              </div>
            </Link>))}
        </div>
      </div>
    </section>);
}
