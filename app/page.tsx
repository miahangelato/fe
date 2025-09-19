"use client";
import React, { useState, useEffect, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { HyperText } from "@/components/magicui/hyper-text";
import { Footer } from "@/components/Footer";
import {
  FileText,
  User,
  Fingerprint,
  BarChart3,
  ArrowRight,
  Shield,
  Brain,
  Heart,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Consent",
    description:
      "Review and agree to our privacy-first consent form before starting.",
    icon: <FileText />,
  },
  {
    title: "Personal Information",
    description: (
      <div className="flex flex-col gap-2">
        Enter your age, gender, height, weight, and donation eligibility.
      </div>
    ),
    icon: <User />,
  },
  {
    title: "Fingerprint Scan & Analysis",
    description:
      "Scan your fingerprint for AI-powered dermatoglyphic analysis.",
    icon: <Fingerprint />,
  },
  {
    title: "Results & Recommendations",
    description:
      "Get instant predictions, risk assessment, and donation guidance.",
    icon: <BarChart3 />,
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const hasPlayedIntro = useRef(false);

  useEffect(() => {
    // For kiosk mode, we'll skip the intro video to save time
    if (!hasPlayedIntro.current && typeof window !== "undefined") {
      // Uncomment the below to re-enable intro video if needed
      /*
      if (!window.sessionStorage.getItem("introPlayed")) {
        setShowIntro(true);
        hasPlayedIntro.current = true;
        window.sessionStorage.setItem("introPlayed", "true");
        const timer = setTimeout(() => {
          setShowIntro(false);
          setShowTransition(true);
          const transitionTimer = setTimeout(
            () => setShowTransition(false),
            350
          );
          return () => clearTimeout(transitionTimer);
        }, 5000);
        return () => clearTimeout(timer);
      }
      */
    }
  }, []);

  const handleStartClick = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/consent");
    }, 500);
  };

  return (
    <div className="relative flex flex-col h-screen w-screen bg-white overflow-hidden" style={{ height: '100vh' }}>
      {/* Intro Video */}
      {showIntro && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <video
            src="/landing-page/fprint.mp4"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            onEnded={() => {
              setShowIntro(false);
              setShowTransition(true);
              setTimeout(() => setShowTransition(false), 500);
            }}
          />
        </div>
      )}

      {/* Transition Loading Overlay */}
      {showTransition && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
          <LoaderCircle
            className="animate-spin"
            style={{ stroke: "#00c2cb", width: "5rem", height: "5rem" }}
          />
        </div>
      )}

      {/* Main Landing Page */}
      {!showIntro && !showTransition && (
        <div className="flex flex-col w-full h-full max-w-[1920px] mx-auto">
          {/* Header/Navigation - More compact */}
          <header className="w-full py-1 px-6 md:px-12 lg:px-16 xl:px-24 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[#00c2cb]">P</span>
              <span className="text-lg font-medium text-gray-700">rintalyzer</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-[#00c2cb]">Feed</a>
              <a href="#" className="text-sm text-gray-600 hover:text-[#00c2cb]">About</a>
              <a href="#" className="text-sm text-gray-600 hover:text-[#00c2cb]">Results</a>
              <a href="#" className="text-sm text-gray-600 hover:text-[#00c2cb]">Contact</a>
            </nav>
            <div className="flex space-x-3">
              <button className="border border-gray-300 rounded-full px-4 py-0.5 text-xs text-gray-700 hover:bg-gray-50">Consent</button>
              <button className="bg-[#00c2cb] rounded-full px-4 py-0.5 text-xs text-white hover:bg-[#00b3bd]">Start Therapy</button>
            </div>
          </header>

          {/* Main Hero Section - More compact for kiosk display */}
          <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24 py-2 flex flex-col md:flex-row items-center justify-between">
            {/* Left content */}
            <div className="w-full md:w-[45%] flex flex-col">
              <div className="text-sm text-[#00c2cb] font-medium mb-0.5">Recent insights</div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
                Discover your blood group<br />
                and fingerprint analysis.
              </h1>
              <p className="text-gray-600 mb-3 text-sm max-w-xl">
                A fingerprint-powered AI system that predicts diabetes risk,
                blood group and evaluates blood donation eligibility - combining
                dermatoglyphics with advanced machine learning.
              </p>

              {/* Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={handleStartClick}
                  className="bg-[#00c2cb] hover:bg-[#00adb5] text-white px-6 py-1.5 rounded-md transition-colors duration-200 font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <LoaderCircle className="animate-spin h-5 w-5 mr-2" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Fingerprint className="mr-2 h-5 w-5" />
                      <span>Click to Start</span>
                    </div>
                  )}
                </Button>
                <button className="border border-gray-300 text-gray-700 px-6 py-1.5 rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium">
                  AI helper
                </button>
              </div>
            </div>

            {/* Right image - single card with fingerprint */}
            <div className="w-full md:w-[50%] flex justify-end mt-2 md:mt-0">
              <div className="relative w-full max-w-lg">
                {/* Light blue background container */}
                
                {/* Triptych card with fingerprints - clean shadow design */}
                <div className="relative h-[370px] w-full flex items-center justify-center">
                  {/* Left fingerprint (showing full image) */}
                  <div className="absolute left-0 bg-white rounded-xl" 
                       style={{ 
                        width: '150px', 
                        height: '210px',
                        boxShadow: '0 15px 35px rgba(0, 194, 203, 0.15), 0 5px 15px rgba(0, 0, 0, 0.05)',
                        zIndex: 1,
                        transform: 'translateX(20px)'
                       }}>
                    <div className="flex items-center justify-center h-full p-2">
                      <div className="relative w-full h-full bg-white rounded-lg flex items-center justify-center">
                        <img 
                          src="/fprint.png" 
                          alt="Left Fingerprint" 
                          className="w-[95%] h-[95%] object-contain"
                          style={{
                            opacity: '0.8',
                            filter: "brightness(1) contrast(1.05) drop-shadow(0 4px 6px rgba(0, 194, 203, 0.15))"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Right fingerprint (showing full image) */}
                  <div className="absolute right-0 bg-white rounded-xl" 
                       style={{ 
                        width: '150px', 
                        height: '210px',
                        boxShadow: '0 15px 35px rgba(0, 194, 203, 0.15), 0 5px 15px rgba(0, 0, 0, 0.05)',
                        zIndex: 1,
                        transform: 'translateX(-20px)'
                       }}>
                    <div className="flex items-center justify-center h-full p-2">
                      <div className="relative w-full h-full bg-white rounded-lg flex items-center justify-center">
                        <img 
                          src="/fprint.png" 
                          alt="Right Fingerprint" 
                          className="w-[95%] h-[95%] object-contain"
                          style={{
                            opacity: '0.8',
                            filter: "brightness(1) contrast(1.05) drop-shadow(0 4px 6px rgba(0, 194, 203, 0.15))"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Main card with fingerprint */}
                  <div className="bg-white rounded-xl relative" 
                       style={{ 
                         width: '220px', 
                         height: '300px',
                         boxShadow: '0 20px 40px rgba(0, 194, 203, 0.2), 0 8px 20px rgba(0, 0, 0, 0.06)',
                         zIndex: 2
                       }}>
                    <div className="flex items-center justify-center h-full p-3">
                      <div className="relative w-full h-full bg-white rounded-lg flex items-center justify-center">
                        <img 
                          src="/fprint.png" 
                          alt="Fingerprint" 
                          className="w-full h-full object-contain"
                          style={{
                            margin: '0 auto',
                            filter: "drop-shadow(0 10px 20px rgba(0, 194, 203, 0.25))"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features section - Fixed for visibility */}
          <div className="w-full px-12 md:px-24 lg:px-16 xl:px-24 py-4 grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-5 border border-[#00c2cb] hover:shadow-lg transition-shadow duration-200">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#e4f7f8] mb-3">
                  <span className="text-[#00c2cb] text-lg">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-lg font-medium mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <div className="text-sm text-gray-600">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
          
          {/* Compact footer for kiosk display */}
          <Footer />
        </div>
      )}
    </div>
  );
}
