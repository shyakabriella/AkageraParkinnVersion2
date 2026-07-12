import { services } from '../data/services';
import p5 from '../Assets/p5.jpg';

export default function Services() {
    return (
        <>
            {/* Header Banner */}
            <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96 mt-20">
                <img src={p5} alt="Our Service banner" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl md:text-6xl text-center px-4">
                        Our Service
                    </h1>
                </div>
            </div>

            {/* Intro text */}
            <section className="bg-white px-4 py-16 text-center sm:py-24">
                <div className="container-x mx-auto max-w-4xl">
                    <h2 className="font-display text-3xl font-semibold text-forest-950 sm:text-4xl lg:text-[2.5rem]">
                        Explore Our Services at Akagera Park Inn
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-forest-800/80 sm:mt-6 sm:text-lg">
                        At Akagera Park Inn, we’re committed to creating an experience that goes beyond the ordinary. From luxurious accommodations and exceptional dining to unique cultural activities and relaxing wellness options, each service is crafted to make your stay unforgettable.
                    </p>
                </div>
            </section>

            {/* Services Cards List */}
            <section className="bg-[#f8f9fa] py-16 sm:py-24">
                <div className="container-x max-w-6xl">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <div key={service.id} className="flex flex-col overflow-hidden rounded-md border border-forest-900/10 bg-white">
                                <div className="relative h-56 overflow-hidden">
                                    <img src={service.image} alt={service.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                                </div>
                                <div className="flex flex-1 flex-col p-6 sm:p-8">
                                    <h3 className="font-display text-xl font-semibold text-forest-950">
                                        {service.title}
                                    </h3>
                                    <p className="mt-4 flex-1 text-base leading-relaxed text-forest-800/90">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
