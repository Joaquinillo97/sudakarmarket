
import HeroSection from "@/components/home/HeroSection";
import CTASection from "@/components/home/CTASection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ActionBanners from "@/components/home/ActionBanners";
import { useEffect } from "react";

const Index = () => {
  // Simplified preloading - only using PNG
  useEffect(() => {
    const img = new Image();
    img.src = "/images/black-lotus.png";
    img.onload = () => console.log("Index: Black lotus PNG preloaded successfully");
    img.onerror = () => console.error("Index: Failed to preload Black Lotus PNG");
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
