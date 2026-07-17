import LogoIntro from "@/components/LogoIntro";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AmbientSection from "@/components/AmbientSection";
import TeraSection from "@/components/TeraSection";
import MenuPreview from "@/components/MenuPreview";
import BrandDetails from "@/components/BrandDetails";
import FounderSection from "@/components/FounderSection";
import ReviewsSection from "@/components/ReviewsSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background">
      <LogoIntro initiallyVisible={true} />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AmbientSection />
        <TeraSection />
        <MenuPreview />
        <BrandDetails />
        <FounderSection />
        <ReviewsSection />
        <MapSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
