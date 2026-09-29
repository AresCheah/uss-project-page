import Footer from "@/components/layout/Footer";
import TopNav from "@/components/layout/TopNav";
import AbstractSection from "@/components/sections/AbstractSection";
import BibtexSection from "@/components/sections/BibtexSection";
import ContributionsSection from "@/components/sections/ContributionsSection";
import ExperimentSection from "@/components/sections/ExperimentSection";
import HeroSection from "@/components/sections/HeroSection";
import HeroReel from "@/components/sections/HeroReel";
import HighlightStats from "@/components/sections/HighlightStats";
import MethodSection from "@/components/sections/MethodSection";
import MotivationSection from "@/components/sections/MotivationSection";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-graphite text-ivory">
      <div className="relative z-10">
        <TopNav />
        <main>
          <HeroSection />
          <HeroReel />
          <HighlightStats />
          <AbstractSection />
          <MotivationSection />
          <ContributionsSection />
          <MethodSection />
          <ExperimentSection />
          <BibtexSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
