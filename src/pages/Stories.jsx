import { Star, Quote } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Link } from '../components/Link';
import { useContent } from '../contexts/ContentContext';
export default function Stories() {
    const { content } = useContent();
    const testimonials = content.testimonials || [];
    const [featured, ...rest] = testimonials;
    return (<>
      <PageHeader eyebrow="Guest Reviews" title={<>
            What our guests
            <span className="italic text-sand-200"> are saying.</span>
          </>} subtitle="Beautiful rooms, amazing food, and exceptional hospitality — hear from guests who have stayed at Akagera Park Inn." image="https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2000&auto=format&fit=crop"/>

      {/* Featured testimonial */}
      <section className="bg-forest-900 py-24 text-sand-50 sm:py-32">
        <div className="container-x">
          <figure className="reveal mx-auto max-w-4xl text-center">
            <Quote className="mx-auto h-12 w-12 text-sand-300/40" strokeWidth={1}/>
            <div className="mt-5 flex justify-center gap-1">
              {Array.from({ length: featured.rating }).map((_, i) => (<Star key={i} className="h-5 w-5 fill-sand-300 text-sand-300" strokeWidth={0}/>))}
            </div>
            <blockquote className="mt-6 font-display text-3xl font-medium leading-snug sm:text-4xl">
              "{featured.quote}"
            </blockquote>
            <figcaption className="mt-8 flex items-center justify-center gap-4">
              <img src={featured.avatar} alt={featured.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-sand-50/20" loading="lazy"/>
              <div className="text-left">
                <div className="font-display text-lg font-semibold text-sand-50">
                  {featured.name}
                </div>
                <div className="text-xs uppercase tracking-wider text-sand-200/60">
                  {featured.detail}
                </div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Grid of stories */}
      <section className="bg-sand-50 bg-grain py-24 sm:py-32">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((s, i) => (<figure key={s.name} className="reveal flex flex-col rounded-3xl bg-white p-8 shadow-soft ring-1 ring-forest-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift" data-reveal-delay={`${(i % 3) * 80}`}>
                <Quote className="h-8 w-8 text-forest-700/30" strokeWidth={1}/>
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: s.rating }).map((_, idx) => (<Star key={idx} className="h-4 w-4 fill-sand-500 text-sand-500" strokeWidth={0}/>))}
                </div>
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-forest-800/85">
                  "{s.quote}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-4 border-t border-forest-900/10 pt-5">
                  <img src={s.avatar} alt={s.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-forest-700/15" loading="lazy"/>
                  <div>
                    <div className="font-display text-base font-semibold text-forest-950">
                      {s.name}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-forest-700/60">
                      {s.detail}
                    </div>
                  </div>
                </figcaption>
              </figure>))}
          </div>

          <div className="reveal mt-16 rounded-3xl bg-forest-800 p-10 text-center text-sand-50 sm:p-14">
            <h2 className="font-display text-3xl font-medium sm:text-4xl">
              Ready to write your own?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sand-100/80">
              The lake is waiting, the fire is lit, and the rangers know where
              the lions slept last night.
            </p>
            <Link to="/book" className="btn-primary mt-8">
              Plan Your Escape
            </Link>
          </div>
        </div>
      </section>
    </>);
}
