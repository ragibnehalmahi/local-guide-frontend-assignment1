// local-guide-frontend/my-app/app/page.tsx
import Hero from "@/components/modules/Home/Hero";
import FeaturedCities from "@/components/modules/Home/FeaturedCities";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import TopRatedGuides from "@/components/modules/Home/TopRatedGuides";
import Categories from "@/components/modules/Home/Categories";
import CTASection from "@/components/modules/Home/CTASection";
import Testimonials from "@/components/modules/Home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCities />
      <HowItWorks />
      <Categories />
      <TopRatedGuides />
      <Testimonials />
      <CTASection />
    </>
  );
}