import { Clock, Calendar, ArrowUpRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Link } from '../components/Link';
import { experiences as staticExperiences } from '../data/experiences';
import { useContent } from '../contexts/ContentContext';
import p5 from '../Assets/p5.jpg';
export default function Experiences() {
    const { content } = useContent();
    const experiences = content.experiences.map(e => ({
      ...e,
      image: e.customImage || staticExperiences.find(se => se.slug === e.slug)?.image,
    }));
    return (<>
      <PageHeader eyebrow="Services" title={<>
            Restaurant, pool, laundry
            <span className="italic text-sand-200"> and more.</span>
          </>} subtitle="Book any service with or without a room — restaurant, bar, laundry, and airport shuttle. Combine services however suits your trip." image={p5}/>

      <section className="bg-sand-50 bg-grain py-24 sm:py-32">
        <div className="container-x">
          <div className="grid gap-8 md:grid-cols-2">
            {experiences.map((e, i) => (<Link key={e.slug} to={`/experiences/${e.slug}`} className="reveal group relative overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-forest-900/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift" data-reveal-delay={`${(i % 2) * 100}`}>
                <div className="relative h-64 overflow-hidden">
                  <img src={e.image} alt={e.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent"/>

                </div>
                <div className="p-7">
                  <h2 className="font-display text-2xl font-semibold text-forest-950">{e.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-forest-800/75">{e.body}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-forest-900/10 pt-4 text-xs text-forest-700/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" strokeWidth={1.5}/> {e.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" strokeWidth={1.5}/> {e.when}
                    </span>

                    <span className="ml-auto inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-forest-800">
                      View
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/>
                    </span>
                  </div>
                </div>
              </Link>))}
          </div>
        </div>
      </section>
    </>);
}
