import { useParams } from 'react-router-dom';
import { Clock, Calendar, Gauge, Check, ArrowLeft } from 'lucide-react';
import { Link } from '../components/Link';
import { experiences as staticExperiences } from '../data/experiences';
import { useContent } from '../contexts/ContentContext';
import NotFound from './NotFound';
const difficultyColor = {
    Moderate: 'bg-sand-500/20 text-sand-700',
    Adventurous: 'bg-earth-500/20 text-earth-700',
};
export default function ExperienceDetail() {
    const { slug } = useParams();
    const { content } = useContent();
    const experiences = content.experiences.map(e => ({
      ...e,
      image: e.customImage || staticExperiences.find(se => se.slug === e.slug)?.image,
    }));
    const exp = experiences.find(e => e.slug === slug);
    if (!exp) return <NotFound />;
    const others = experiences.filter((e) => e.slug !== exp.slug).slice(0, 3);
    return (<>
      <header className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <img src={exp.image} alt={exp.title} className="h-full w-full object-cover" loading="eager"/>
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/40 to-forest-950/80"/>
        </div>
        <div className="container-x relative flex min-h-[60vh] flex-col justify-end pb-16 pt-32">
          <Link to="/experiences" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-sand-200/80 transition-colors hover:text-sand-50">
            <ArrowLeft className="h-4 w-4"/> All experiences
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${difficultyColor[exp.difficulty]}`}>
              {exp.difficulty}
            </span>
            <span className="rounded-full bg-sand-50/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sand-50 backdrop-blur-sm">
              {exp.duration} · {exp.when}
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-tight text-sand-50 opacity-0 animate-fade-in-up sm:text-5xl lg:text-6xl" style={{ animationDelay: '0.2s' }}>
            {exp.title}
          </h1>
        </div>
      </header>

      <section className="bg-sand-50 bg-grain py-24 sm:py-32">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow reveal">The experience</p>
              <h2 className="reveal mt-5 font-display text-3xl font-medium leading-tight text-forest-950 sm:text-4xl">
                {exp.body}
              </h2>
              <p className="reveal mt-6 text-lg leading-relaxed text-forest-800/85">
                {exp.longDesc}
              </p>

              <div className="reveal mt-10 grid grid-cols-3 gap-4 rounded-2xl border border-forest-900/10 bg-white/60 p-6">
                <div>
                  <Clock className="h-5 w-5 text-forest-600" strokeWidth={1.5}/>
                  <div className="mt-2 text-xs uppercase tracking-wider text-forest-700/60">Duration</div>
                  <div className="font-display text-xl text-forest-950">{exp.duration}</div>
                </div>
                <div>
                  <Calendar className="h-5 w-5 text-forest-600" strokeWidth={1.5}/>
                  <div className="mt-2 text-xs uppercase tracking-wider text-forest-700/60">When</div>
                  <div className="font-display text-xl text-forest-950">{exp.when}</div>
                </div>
                <div>
                  <Gauge className="h-5 w-5 text-forest-600" strokeWidth={1.5}/>
                  <div className="mt-2 text-xs uppercase tracking-wider text-forest-700/60">Level</div>
                  <div className="font-display text-xl text-forest-950">{exp.difficulty}</div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="reveal sticky top-28 rounded-3xl border border-forest-900/10 bg-white p-7 shadow-soft">
                <h3 className="font-display text-2xl font-semibold text-forest-950">
                  What is included
                </h3>
                <ul className="mt-5 space-y-3">
                  {exp.included.map((item) => (<li key={item} className="flex items-center gap-3 text-forest-800/85">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-700/10 text-forest-700">
                        <Check className="h-3.5 w-3.5" strokeWidth={2}/>
                      </span>
                      {item}
                    </li>))}
                </ul>
                <Link to="/book" className="btn-primary mt-7 w-full">
                  Book This Experience
                </Link>
                <p className="mt-4 text-center text-xs text-forest-700/60">
                  Experiences can be added to any stay or booked on arrival,
                  subject to availability.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-forest-950 py-20 text-sand-50">
        <div className="container-x">
          <h2 className="reveal font-display text-3xl font-medium">More to do</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {others.map((e) => (<Link key={e.slug} to={`/experiences/${e.slug}`} className="reveal group relative overflow-hidden rounded-3xl">
                <div className="relative h-56 overflow-hidden">
                  <img src={e.image} alt={e.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent"/>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="text-[10px] uppercase tracking-widest text-sand-200/70">
                    {e.duration} · {e.when}
                  </span>
                  <h3 className="mt-1 font-display text-xl font-semibold text-sand-50">{e.title}</h3>
                </div>
              </Link>))}
          </div>
        </div>
      </section>
    </>);
}
