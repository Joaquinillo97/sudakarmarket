
import HeroSection from "@/components/home/HeroSection";
import CTASection from "@/components/home/CTASection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ActionBanners from "@/components/home/ActionBanners";
import { useEffect } from "react";
// Import the image directly
import blackLotusImage from "/images/black-lotus.png";

const Index = () => {
  // Multiple approaches to preload the image
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || "";
    
    console.log("Index: Attempting to preload Black Lotus image");
    console.log("Index: Direct import path:", blackLotusImage);
    console.log("Index: Using base URL path:", baseUrl + "images/black-lotus.png");
    
    // Try with direct import
    const img = new Image();
    img.src = blackLotusImage;
    img.onload = () => console.log("Index: Black lotus image preloaded successfully with direct import");
    img.onerror = (e) => {
      console.error("Index: Failed to preload Black Lotus with direct import", e);
      
      // Try with base URL
      const imgWithBase = new Image();
      imgWithBase.src = baseUrl + "images/black-lotus.png";
      imgWithBase.onload = () => console.log("Index: Black lotus image preloaded successfully with base URL");
      imgWithBase.onerror = () => console.error("Index: All preload attempts failed");
    };
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
