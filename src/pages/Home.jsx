import Hero from '../components/Hero';
import Welcome from '../components/home/Welcome';
import DiscoverGrid from '../components/home/DiscoverGrid';
import FeaturedStays from '../components/home/FeaturedStays';
import FeaturedExperiences from '../components/home/FeaturedExperiences';
import TestimonialHighlight from '../components/home/TestimonialHighlight';
import CTABand from '../components/home/CTABand';
export default function Home() {
    return (<>
      <Hero />
      <Welcome />
      <DiscoverGrid />
      <FeaturedStays />
      <FeaturedExperiences />
      <TestimonialHighlight />
      <CTABand />
    </>);
}
