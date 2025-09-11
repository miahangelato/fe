"use client";
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { HyperText } from "@/components/magicui/hyper-text";

const features = [
  {
    title: "Consent",
    description:
      "Before we begin, review and agree to the consent form. This ensures transparency and protects your privacy while we process your fingerprint data.",
    icon: <i className="bi bi-1-circle-fill"></i>,
  },
  {
    title: "Personal Information",
    description: (
      <div className="flex flex-col gap-2">
        Provide your basic details:
        <ul className="list-disc list-inside">
          <li>Age</li>
          <li>Gender</li>
          <li>Height & Weight</li>
          <li>Blood Donation Eligibility</li>
        </ul>
        These details help refine predictions and assess donation readiness.
      </div>
    ),
    icon: <i className="bi bi-2-circle-fill"></i>,
  },
  {
    title: "Fingerprint Scan & Analysis",
    description:
      "Place your finger on the scanner and make sure it's clean. Your fingerprint is enhanced for clarity, classified into dermatoglyphic patterns (Loops, Whorls, or Arches), and processed by advanced machine learning models.",
    icon: <i className="bi bi-3-circle-fill"></i>,
  },
  {
    title: "Results & Recommendations",
    description:
      "Instantly receive your predicted blood group, diabetes risk level, and blood donation eligibility. If eligible, we’ll guide you to nearby hospitals. Preventive health advice is also provided.",
    icon: <i className="bi bi-4-circle-fill"></i>,
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    // Intro video auto hide after 5s
    const timer = setTimeout(() => {
      setShowIntro(false);
      setShowTransition(true);

      const transitionTimer = setTimeout(() => setShowTransition(false), 350);
      return () => clearTimeout(transitionTimer);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartClick = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/consent");
    }, 500);
  };

  return (
    <div className="relative flex flex-col gap-4 min-h-screen p-4 overflow-hidden">
      {/* Intro Video */}
      {showIntro && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <video
            src="/landing-page/starting.mp4"
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
          style={{ backgroundColor: "#010b28" }} // custom bg
        >
          <LoaderCircle
            className="animate-spin"
            style={{ stroke: "#06fdcc", width: "5rem", height: "5rem" }} // custom icon color & size
          />
        </div>
      )}

      {/* Main Landing Page */}
      {!showIntro && !showTransition && (
        <>
          <video
            src="/landing-page/lpvid.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <Alert className="relative z-10 bg-red/60 border-2 border-red-600 text-red-800 backdrop-blur-md flex items-start p-4 rounded-lg">
            <TriangleAlert className="h-6 w-6 text-red-600 mr-3 mt-1" />
            <AlertDescription className="text-white text-base leading-relaxed relative flex">
              <span className="font-bold text-white">Important:</span> This tool
              is for educational purposes only and not a substitute for
              professional medical advice. Always consult a healthcare provider
              for medical concerns.
            </AlertDescription>
          </Alert>

          <div className="grid grid-col-2 gap-4 p-2 justify-left z-10 relative">
            <HyperText className="relative text-white text-8xl font-bold">
              Printalyzer
            </HyperText>
            <p className="relative text-white text-2xl max-w-3xl">
              A fingerprint-powered AI system that predicts blood group,
              assesses disease risks, and evaluates blood donation eligibility &mdash;
              combining dermatoglyphics with advanced machine learning.
            </p>

            <Button
              onClick={handleStartClick}
              disabled={loading}
              className="relative bg-gradient-to-r from-blue-800 via-green-800 to-blue-900 
                 hover:from-blue-700 hover:to-indigo-800 text-white px-10 py-9 
                 rounded-2xl text-4xl font-bold shadow-lg 
                 transition-all duration-300 ease-in-out transform hover:scale-105
                 focus:ring-4 focus:ring-blue-400 w-180 mt-6 cursor-pointer flex items-center justify-between"
            >
              {loading ? (
                <div className="flex items-center gap-3 w-full justify-center">
                  <LoaderCircle className="animate-spin inline-block" />
                  Loading...
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <i className="bi bi-fingerprint text-4xl"></i>
                    <span>Tap to Start</span>
                  </div>
                  <i className="bi bi-arrow-right text-4xl"></i>
                </>
              )}
            </Button>

            <div className="relative z-10 px-6 mt-13">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-md p-6 rounded-2xl shadow-lg 
                    flex flex-col gap-3 text-white hover:scale-105 transition-transform duration-300
                    bg-gradient-to-t from-black via-black/70 to-transparent"
                  >
                    <div className="text-4xl">{feature.icon}</div>
                    <h3 className="text-2xl font-semibold">{feature.title}</h3>
                    <div className="text-base text-gray-200">
                      {feature.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
