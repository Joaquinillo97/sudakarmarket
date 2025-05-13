
import HeroSection from "@/components/home/HeroSection";
import CTASection from "@/components/home/CTASection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ActionBanners from "@/components/home/ActionBanners";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ActionBanners />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
