
import HeroSection from "@/components/home/HeroSection";
import CTASection from "@/components/home/CTASection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ActionBanners from "@/components/home/ActionBanners";
import { useEffect } from "react";

const Index = () => {
  // Precargar imágenes críticas
  useEffect(() => {
    const preloadImages = [
      "/images/black-lotus.png",
      "/images/black-lotus.jpg"
    ];
    
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);
  
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
