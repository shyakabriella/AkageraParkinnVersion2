import { Star, Quote } from 'lucide-react';
import { Link } from '../Link';
import { testimonials } from '../../data/testimonials';
export default function TestimonialHighlight() {
    const featured = testimonials[0];
    return (<section className="bg-sand-100 bg-grain py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="eyebrow reveal">Guest Stories</p>
            <h2 className="reveal mt-5 font-display text-4xl font-medium leading-tight text-forest-950 sm:text-5xl">
              The best reviews are
              <span className="italic text-forest-700"> the ones told around a fire.</span>
            </h2>
            <p className="reveal mt-6 text-lg leading-relaxed text-forest-800/80">
              We have been lucky with our guests — curious, kind, and quick
              to tell us when something mattered. Here is one of them.
            </p>
            <Link to="/stories" className="reveal mt-8 inline-flex items-center gap-2 rounded-full border border-forest-700/30 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-forest-800 transition-all hover:bg-forest-700 hover:text-sand-50">
              Read more stories
            </Link>
          </div>

          <figure className="reveal lg:col-span-7">
            <div className="relative rounded-3xl bg-white p-8 shadow-soft ring-1 ring-forest-900/5 sm:p-10">
              <Quote className="h-10 w-10 text-forest-700/30" strokeWidth={1}/>
              <div className="mt-4 flex gap-1">
                {Array.from({ length: featured.rating }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-sand-500 text-sand-500" strokeWidth={0}/>))}
              </div>
              <blockquote className="mt-5 font-display text-2xl font-medium leading-snug text-forest-950 sm:text-3xl">
                "{featured.quote}"
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4 border-t border-forest-900/10 pt-6">
                <img src={featured.avatar} alt={featured.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-forest-700/20" loading="lazy"/>
                <div>
                  <div className="font-display text-lg font-semibold text-forest-950">
                    {featured.name}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-forest-700/60">
                    {featured.detail}
                  </div>
                </div>
              </figcaption>
            </div>
          </figure>
        </div>
      </div>
    </section>);
}
