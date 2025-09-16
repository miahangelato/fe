"use client";
import React, { useState, useEffect, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { HyperText } from "@/components/magicui/hyper-text";

const features = [
  {
    title: "Consent",
    description:
      "Review and agree to our privacy-first consent form before starting.",
    icon: <i className="bi bi-file-earmark-post"></i>,
  },
  {
    title: "Personal Information",
    description: (
      <div className="flex flex-col gap-2">
        Enter your age, gender, height, weight, and donation eligibility.
      </div>
    ),
    icon: <i className="bi bi-person-bounding-box"></i>,
  },
  {
    title: "Fingerprint Scan & Analysis",
    description:
      "Scan your fingerprint for AI-powered dermatoglyphic analysis.",
    icon: <i className="bi bi-fingerprint"></i>,
  },
  {
    title: "Results & Recommendations",
    description:
      "Get instant predictions, risk assessment, and donation guidance.",
    icon: <i className="bi bi-graph-up-arrow"></i>,
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const hasPlayedIntro = useRef(false);

  useEffect(() => {
    // Only play intro video if it hasn't played in this browser session
    if (!hasPlayedIntro.current && typeof window !== "undefined") {
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
    }
  }, []);

  const handleStartClick = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/consent");
    }, 500);
  };

  return (
    <div
      className="relative flex flex-col gap-4 min-h-screen p-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, #fff 40%, #78caff 100%), linear-gradient(to bottom, transparent 60%, #78caff 100%)",
        backgroundBlendMode: "overlay",
      }}
    >
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
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{
            background: "linear-gradient(120deg, #fff 60%, #78caff 100%)",
          }}
        >
          <LoaderCircle
            className="animate-spin"
            style={{ stroke: "#06fdcc", width: "5rem", height: "5rem" }}
          />
        </div>
      )}

      {/* Main Landing Page */}
      {!showIntro && !showTransition && (
        <div className="flex flex-col">
          {/* Alert at the top */}
          <div className="w-full flex justify-center mb-2">
            <Alert className="bg-red-700 border-2 border-red-600 text-white backdrop-blur-md flex items-start p-4 rounded-xl shadow-lg pointer-events-auto">
              <i className="bi bi-exclamation-triangle-fill text-3xl text-white mr-3" />
              <AlertDescription className="text-white text-2xl leading-relaxed relative flex">
                <span className="font-bold text-white mr-2">Important:</span>
                This tool is for educational purposes only and not a substitute
                for professional medical advice. Always consult a healthcare
                provider for medical concerns.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex w-full h-full">
            {/* Left content */}
            <div className="flex-[0.5] flex-col justify-center pl-10 mt-14">
              <HyperText className="text-9xl font-extrabold text-[#121c58] leading-tight">
                Printalyzer
              </HyperText>
              <h1 className="text-5xl font-semibold text-[#3a4b5e] mb-20">
                Your Health Insights at Your Fingertips
              </h1>
              <p className="text-3xl text-[#3a4b5e] mt-10">
                A fingerprint-powered AI system that predicts diabetes risk,
                blood group and evaluates blood donation eligibility - combining
                dermatoglyphics with advance machine learning.
              </p>

              {/* Button */}
              <div className="mt-8">
                <Button
                  onClick={handleStartClick}
                  className="bg-gradient-to-r from-[#5ca7e0] to-[#3a87d5] hover:from-[#3a87d5] hover:to-[#5ca7e0] text-white text-4xl font-extrabold px-15 py-10 rounded-2xl shadow-lg transition duration-300 cursor-pointer flex items-center gap-4 hover:scale-105 min-w-[320px] justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin h-8 w-8" />
                      <span
                        className="ml-2"
                        style={{
                          width: "170px",
                          display: "inline-block",
                          textAlign: "left",
                        }}
                      >
                        Loading...
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-fingerprint text-4xl"></i>
                      <span>Tap to Start →</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right image */}
            <div className="flex items-center justify-end flex-[1.5]">
              <img
                src="/fprint.png"
                alt="Logo"
                className="absolute w-auto size-[550px] mt-12 object-contain animate-pulse"
                style={{ transform: "rotate(-8deg)" }}
              />
            </div>
          </div>

          {/* Features section below left and right content */}
          <div className="flex flex-row mt-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex-1 bg-white/80 backdrop-blur-md border-3 border-[#75a9d7] rounded-xl p-10 m-2 shadow-xl shadow-[#3a87d5]/30 hover:scale-105 transition-transform duration-300"
              >
                <h3 className="flex items-center gap-3 text-4xl font-bold mb-2 text-[#121c58]">
                  <span className="text-5xl text-[#3a87d5]">
                    {feature.icon}
                  </span>
                  {feature.title}
                </h3>
                <div className="text-2xl text-[#3a4b5e]">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
