import { useParams } from 'react-router-dom';
import { Users, Maximize, Eye, Check, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from '../components/Link';
import { suites as staticSuites } from '../data/suites';
import { useContent } from '../contexts/ContentContext';
import NotFound from './NotFound';
export default function SuiteDetail() {
    const { slug } = useParams();
    const { content } = useContent();
    // Merge editable text with static images
    const suites = content.suites.map(s => ({
      ...s,
      image: s.customImage || staticSuites.find(st => st.slug === s.slug)?.image,
      gallery: staticSuites.find(st => st.slug === s.slug)?.gallery,
    }));
    const suite = suites.find(s => s.slug === slug);
    if (!suite) return <NotFound />;
    const others = suites.filter((s) => s.slug !== suite.slug);
    return (<>
      {/* Hero */}
      <header className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <img src={suite.image} alt={suite.name} className="h-full w-full object-cover" loading="eager"/>
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/40 to-forest-950/80"/>
        </div>
        <div className="container-x relative flex min-h-[60vh] flex-col justify-end pb-16 pt-32">
          <Link to="/stays" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-sand-200/80 transition-colors hover:text-sand-50">
            <ArrowLeft className="h-4 w-4"/> All suites
          </Link>
          <p className="eyebrow animate-fade-in-up text-sand-200/90 opacity-0" style={{ animationDelay: '0.1s' }}>
            {suite.tagline}
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-sand-50 opacity-0 animate-fade-in-up sm:text-5xl lg:text-6xl" style={{ animationDelay: '0.25s' }}>
            {suite.name}
          </h1>
        </div>
      </header>

      {/* Body */}
      <section className="bg-sand-50 bg-grain py-24 sm:py-32">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow reveal">The suite</p>
              <h2 className="reveal mt-5 font-display text-3xl font-medium leading-tight text-forest-950 sm:text-4xl">
                Built to dissolve the line between you and the wild.
              </h2>
              <p className="reveal mt-6 text-lg leading-relaxed text-forest-800/85">
                {suite.longDesc}
              </p>

              <div className="reveal mt-10 grid grid-cols-3 gap-4 rounded-2xl border border-forest-900/10 bg-white/60 p-6">
                <div>
                  <Users className="h-5 w-5 text-forest-600" strokeWidth={1.5}/>
                  <div className="mt-2 text-xs uppercase tracking-wider text-forest-700/60">Guests</div>
                  <div className="font-display text-2xl text-forest-950">{suite.guests}</div>
                </div>
                <div>
                  <Maximize className="h-5 w-5 text-forest-600" strokeWidth={1.5}/>
                  <div className="mt-2 text-xs uppercase tracking-wider text-forest-700/60">Size</div>
                  <div className="font-display text-2xl text-forest-950">{suite.size}</div>
                </div>
                <div>
                  <Eye className="h-5 w-5 text-forest-600" strokeWidth={1.5}/>
                  <div className="mt-2 text-xs uppercase tracking-wider text-forest-700/60">View</div>
                  <div className="font-display text-2xl text-forest-950">{suite.view}</div>
                </div>
              </div>

              <h3 className="reveal mt-12 font-display text-2xl font-semibold text-forest-950">
                What is included
              </h3>
              <ul className="reveal mt-5 grid gap-3 sm:grid-cols-2">
                {suite.amenities.map((a) => (<li key={a} className="flex items-center gap-3 text-forest-800/85">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-700/10 text-forest-700">
                      <Check className="h-3.5 w-3.5" strokeWidth={2}/>
                    </span>
                    {a}
                  </li>))}
              </ul>
            </div>

            {/* Booking card */}
            <aside className="lg:col-span-5">
              <div className="reveal sticky top-28 rounded-3xl border border-forest-900/10 bg-white p-7 shadow-soft">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-display text-4xl text-forest-950">${suite.price}</span>
                    <span className="ml-1 text-xs uppercase tracking-wider text-forest-700/60">
                      {suite.per}
                    </span>
                  </div>
                  {suite.featured && (<span className="rounded-full bg-sand-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sand-700">
                      Most Loved
                    </span>)}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-forest-800/75">
                  Rate includes breakfast, the sunrise game drive, park entry
                  for lodge guests, and Wi-Fi in public areas.
                </p>
                <Link to="/book" className="btn-primary mt-6 w-full">
                  Reserve This Suite
                </Link>
                <Link to="/experiences" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-forest-700/30 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-forest-800 transition-all hover:bg-forest-700 hover:text-sand-50">
                  Add Experiences
                  <ArrowUpRight className="h-3.5 w-3.5"/>
                </Link>
                <p className="mt-5 text-center text-xs text-forest-700/60">
                  No payment required to inquire. We hold dates for 48 hours.
                </p>
              </div>
            </aside>
          </div>

          {/* Gallery */}
          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {suite.gallery.map((src, i) => (<div key={src} className="reveal overflow-hidden rounded-2xl" data-reveal-delay={`${i * 80}`}>
                <img src={src} alt={`${suite.name} ${i + 1}`} className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy"/>
              </div>))}
          </div>
        </div>
      </section>

      {/* Other suites */}
      <section className="bg-forest-950 py-20 text-sand-50">
        <div className="container-x">
          <h2 className="reveal font-display text-3xl font-medium">Other places to stay</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {others.map((s) => (<Link key={s.slug} to={`/stays/${s.slug}`} className="reveal group relative overflow-hidden rounded-3xl">
                <div className="relative h-64 overflow-hidden">
                  <img src={s.image} alt={s.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/30 to-transparent"/>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <p className="text-xs uppercase tracking-widest text-sand-200/70">{s.tagline}</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-sand-50">{s.name}</h3>
                  <span className="mt-2 font-display text-xl text-sand-200">${s.price}</span>
                </div>
              </Link>))}
          </div>
        </div>
      </section>
    </>);
}
