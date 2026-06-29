import { createElement } from 'react';
import { Users, Eye, Check } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Link } from '../components/Link';
import { suites as staticSuites } from '../data/suites';
import { useContent } from '../contexts/ContentContext';
function Spec({ icon, label, value }) {
    return (<div className="flex items-center gap-2 text-forest-800/80">
      {createElement(icon, { className: 'h-4 w-4 text-forest-600', strokeWidth: 1.5 })}
      <span className="text-xs uppercase tracking-wider text-forest-700/60">{label}</span>
      <span className="text-sm font-medium text-forest-900">{value}</span>
    </div>);
}
export default function Stays() {
    const { content } = useContent();
    // Merge editable text from ContentContext with static images from data file
    const suites = content.suites.map(suite => ({
      ...suite,
      image: suite.customImage || staticSuites.find(s => s.slug === suite.slug)?.image,
      gallery: staticSuites.find(s => s.slug === suite.slug)?.gallery,
    }));
    return (<>
      <PageHeader eyebrow="Rooms" title={<>
            Comfortable rooms with breakfast included,
            <span className="italic text-sand-200"> minutes from the park.</span>
          </>} subtitle="Twin and double rooms. Each includes a full breakfast, free Wi-Fi, air conditioning, and a private balcony with garden or courtyard views." image={suites[0].image}/>

      <section className="bg-sand-50 bg-grain py-24 sm:py-32">
        <div className="container-x">
          <div className="grid gap-10">
            {suites.map((s, i) => (<article key={s.slug} className={`reveal grid gap-8 overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-forest-900/5 lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>figure]:order-2' : ''}`} data-reveal-delay={`${i * 80}`}>
                <figure className="relative h-72 overflow-hidden lg:h-auto">
                  <img src={s.image} alt={s.name} className="h-full w-full object-cover" loading="lazy"/>
                  {s.featured && (<span className="absolute left-5 top-5 rounded-full bg-sand-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-forest-900">
                      Most Loved
                    </span>)}
                </figure>
                <div className="flex flex-col justify-center p-8 sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-widest text-forest-600">
                    {s.tagline}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-forest-950 sm:text-4xl">
                    {s.name}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-forest-800/80">
                    {s.longDesc}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 border-y border-forest-900/10 py-4">
                    <Spec icon={Users} label="Guests" value={String(s.guests)}/>
                    <Spec icon={Eye} label="View" value={s.view}/>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.amenities.map((a) => (<li key={a} className="inline-flex items-center gap-1.5 rounded-full bg-forest-700/8 px-3 py-1 text-xs font-medium text-forest-800">
                        <Check className="h-3 w-3 text-forest-600" strokeWidth={2}/>
                        {a}
                      </li>))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
                    <div className="flex gap-3">
                     
                      <Link to="https://direct-book.com/properties/akageraparkinn?locale=en&items[0][adults]=2&items[0][children]=0&items[0][infants]=0&currency=USD&checkInDate=2026-06-27&checkOutDate=2026-06-28&trackPage=no" className="btn-primary !py-2.5 !px-6">
                        Reserve a room
                      </Link>
                    </div>
                  </div>
                </div>
              </article>))}
          </div>
        </div>
      </section>
    </>);
}
