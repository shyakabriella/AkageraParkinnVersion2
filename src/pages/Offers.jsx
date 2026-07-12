import { offers } from '../data/offers';
import { Link } from '../components/Link';
import p5 from '../Assets/p5.jpg';

export default function Offers() {
    return (
        <>
            {/* Header Banner */}
            <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96 mt-20">
                <img src={p5} alt="Offers & Packages banner" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl md:text-6xl text-center px-4">
                        Offers & Packages
                    </h1>
                </div>
            </div>

            {/* Intro text */}
            <section className="bg-white px-4 py-16 text-center sm:py-24">
                <div className="container-x mx-auto max-w-4xl">
                    <h2 className="font-display text-3xl font-semibold text-forest-950 sm:text-4xl lg:text-[2.5rem]">
                        Exclusive Offers – Enhance Your Stay with Special Deals
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-forest-800/80 sm:mt-6 sm:text-lg">
                        Take advantage of our exclusive offers at Akagera Park Inn and make your getaway even more enjoyable. From discounted stays to curated experience packages, our special deals give you great value while enjoying the exceptional services and unique activities we offer.
                    </p>
                </div>
            </section>

            {/* Offers Cards List */}
            <section className="bg-white pb-24 sm:pb-32">
                <div className="container-x max-w-6xl">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {offers.map((offer) => (
                            <div key={offer.id} className="flex flex-col overflow-hidden rounded-md border border-forest-900/10 bg-white">
                                <div className="relative h-56 overflow-hidden">
                                    <img src={offer.image} alt={offer.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                                </div>
                                <div className="flex flex-1 flex-col p-6 sm:p-8">
                                    <h3 className="font-display text-xl font-semibold text-forest-950">
                                        {offer.title}
                                    </h3>
                                    <p className="mt-2 text-[11px] uppercase tracking-widest text-forest-600/80">
                                        <strong className="font-bold">VALID:</strong> {offer.validity}
                                    </p>
                                    <p className="mt-4 flex-1 text-base leading-relaxed text-forest-800/90">
                                        {offer.description}
                                    </p>
                                    <div className="mt-6">
                                        <Link 
                                            to={`/offers/${offer.id}`}
                                            className="inline-block bg-[#484a40] text-white font-medium px-5 py-2.5 rounded-sm transition-colors hover:bg-forest-950 text-sm"
                                        >
                                            Learn More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
