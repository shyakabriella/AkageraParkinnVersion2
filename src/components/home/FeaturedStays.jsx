import { ArrowUpRight, Users, Eye } from 'lucide-react';
import { Link } from '../Link';
import { useContent } from '../../contexts/ContentContext';
import { suites as staticSuites } from '../../data/suites';

function Spec({ icon: Icon, label, value }) {
    return (<div className="flex items-center gap-2 text-forest-800/80">
      <Icon className="h-4 w-4 text-forest-600" strokeWidth={1.5}/>
      <span className="text-xs uppercase tracking-wider text-forest-700/60">{label}</span>
      <span className="text-sm font-medium text-forest-900">{value}</span>
    </div>);
}

export default function FeaturedStays() {
    const { content } = useContent();
    const suites = content.suites.map(suite => ({
      ...suite,
      image: suite.customImage || staticSuites.find(s => s.slug === suite.slug)?.image,
    }));
    return (<section className="bg-sand-50 bg-grain py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="max-w-2xl">
            <p className="eyebrow reveal">Rooms</p>
            <h2 className="reveal mt-5 font-display text-4xl font-medium leading-tight text-forest-950 sm:text-5xl">
              Comfortable rooms with breakfast included,
              <span className="block italic text-forest-700"> near Akagera National Park.</span>
            </h2>
          </div>
          <Link to="/stays" className="reveal group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-forest-800 hover:text-forest-600">
            All rooms
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/>
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8">
          {suites.map((s, i) => (<Link key={s.slug} to={`/stays/${s.slug}`} className={`reveal group relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-forest-900/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift lg:max-w-[420px] ${s.featured ? 'lg:-translate-y-4' : ''}`} data-reveal-delay={`${i * 120}`}>
              <div className="relative h-64 overflow-hidden">
                <img src={s.image} alt={s.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy"/>
                {s.featured && (<span className="absolute left-4 top-4 rounded-full bg-sand-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-forest-900">
                    Most Loved
                  </span>)}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl font-semibold text-forest-950">
                  {s.name}
                </h3>
                <p className="text-xs uppercase tracking-wider text-forest-700/60">
                  {s.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-forest-800/75">
                  {s.desc}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 border-y border-forest-900/10 py-4">
                  <Spec icon={Users} label="Guests" value={String(s.guests)}/>
                  <Spec icon={Eye} label="View" value={s.view}/>
                </div>
                <div className="mt-6 flex justify-end">
                  <span className="inline-flex items-center gap-1 rounded-full border border-forest-700/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-forest-800 transition-all group-hover:bg-forest-700 group-hover:text-sand-50">
                    View
                    <ArrowUpRight className="h-3.5 w-3.5"/>
                  </span>
                </div>
              </div>
            </Link>))}
        </div>
      </div>
    </section>);
}
