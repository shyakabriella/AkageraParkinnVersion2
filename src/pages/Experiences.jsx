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
      {/* Short Banner */}
      <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96 mt-20">
        <img src={p5} alt="Experiences banner" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            Experiences
          </h1>
        </div>
      </div>

      {/* Centered Intro text */}
      <section className="bg-white px-4 py-16 text-center sm:py-24">
        <div className="container-x mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-semibold text-forest-950 sm:text-4xl lg:text-[2.5rem]">
            Akagera Activities & Entertainment
          </h2>
          <p className="mt-4 text-base leading-relaxed text-forest-800/80 sm:mt-6 sm:text-lg">
            From peaceful mornings surrounded by nature to lively evenings by the fire, Akagera Park Inn offers a variety of experiences that blend culture, relaxation, and adventure. Explore some of our signature activities below.
          </p>
        </div>
      </section>

      {/* Activities List */}
      <section className="bg-white pb-24 sm:pb-32">
        <div className="container-x max-w-5xl">
          <div className="grid gap-16 lg:gap-24">
            {experiences.map((e, i) => (
              <article key={e.slug} className={`reveal grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? 'lg:[&>figure]:order-2' : ''}`} data-reveal-delay={`${i * 80}`}>
                <figure className="relative overflow-hidden rounded-md">
                  <img src={e.image} alt={e.title} className="h-auto w-full object-cover" loading="lazy"/>
                </figure>
                <div className="flex flex-col justify-center">
                  <h3 className="font-display text-2xl font-semibold text-forest-900 sm:text-3xl">
                    {e.title}
                  </h3>
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-forest-600/80">
                    {e.duration} • {e.when}
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-forest-800/90 sm:text-lg">
                    {e.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>);
}
