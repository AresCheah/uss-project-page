import Footer from "@/components/layout/Footer";
import TopNav from "@/components/layout/TopNav";
import CiteSection from "@/components/sections/CiteSection";
import HeroSection from "@/components/sections/HeroSection";
import MethodSection from "@/components/sections/MethodSection";
import OverviewSection from "@/components/sections/OverviewSection";
import RealRobotSection from "@/components/sections/RealRobotSection";
import ResultsSection from "@/components/sections/ResultsSection";

export default function Home() {
  return (
    <>
      <a className="skip" href="#overview">
        Skip to content
      </a>
      <TopNav />
      <main>
        <HeroSection />
        <OverviewSection />
        <MethodSection />
        <ResultsSection />
        <RealRobotSection />
        <CiteSection />
      </main>
      <Footer />
    </>
  );
}
