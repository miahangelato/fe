"use client";


import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitConsent } from "../../api/api_fingerprint_analysis";
import { useConsent } from "../../contexts/ConsentContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProgressHeader }  from "@/components/ProgressHeader";
import { ConsentButton } from "@/components/consent-button";
import { BackButton, NextButton } from "@/components/Button";
import { 
  CheckCircle, XCircle, FileText, Shield, UserCheck, 
  ArrowLeft, ArrowRight, Fingerprint 
} from "lucide-react";
import { Footer } from "@/components/Footer";

export default function ConsentPage() {
  const [consent, setConsent] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setHasConsent } = useConsent();

  const handleNext = async () => {
    if (consent === null) return;
    setLoading(true);
    try {
      await submitConsent(consent);
      setHasConsent(consent);
      router.push("/personal-info");
    } catch (error) {
      alert("Error submitting consent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}


      {/* Main Content */}
      <main className="w-full px-6 md:px-12 lg:px-16 xl:px-20 py-4 flex-1 flex flex-col">
        {/* Progress Header with Progress Bar */}
        <ProgressHeader 
          currentStep={1}
          totalSteps={4}
          title="Data Privacy Consent"
          subtitle="Your privacy and data security are our top priority as we analyze your health."
          accentColor="#00c2cb"
        />

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10 flex-1">
          {/* What We'll Analyze Card */}
          <div className="bg-white rounded-lg p-5 border border-[#00c2cb] hover:shadow-md transition-shadow duration-200 ">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#e4f7f8] mb-3">
              <FileText className="text-[#00c2cb] h-6 w-6" />
            </div>
            <h2 className="text-xl font-medium mb-2 text-gray-800">What We'll Analyze</h2>
            <p className="text-base text-gray-600 mb-4">We'll analyze your fingerprints and info to provide:</p>

            <div className="space-y-4 mb-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#00c2cb] mr-3 flex-shrink-0" />
                <span className="text-lg text-gray-700">Blood type prediction</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-[#00c2cb] mr-3 flex-shrink-0" />
                <span className="text-lg text-gray-700">Diabetes risk assessment</span>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-start text-sm text-red-800">
                <strong>Important:</strong>&nbsp;This is a screening tool, not a diagnosis.
              </div>
            </div>
          </div>

          {/* Your Privacy Card */}
          <div className="bg-white rounded-lg p-5 border border-[#00c2cb] hover:shadow-md transition-shadow duration-200">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#e4f7f8] mb-3">
              <Shield className="text-[#00c2cb] h-6 w-6" />
            </div>
            <h2 className="text-xl font-medium mb-3 text-gray-800">Your Privacy</h2>

            <div className="grid md:grid-cols-2 gap-6 mt-3">
              <div>
                <h3 className="text-lg font-medium text-[#00c2cb] mb-3">We Collect:</h3>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-[#00c2cb] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-base text-gray-700">Basic info (age, gender, etc.)</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-red-500 mb-3">We Don't:</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-base text-gray-700">Store personal identifiers</span>
                  </div>
                  <div className="flex items-start">
                    <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-base text-gray-700">Share with third parties</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Choice Section */}
        <div className="bg-[#e4f7f8] rounded-lg p-5 border border-[#00c2cb] hover:shadow-md transition-shadow duration-200 mb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            {/* Left side: Icon, Title and description */}
            <div className="md:flex-1">
              <div className="flex items-center mb-2">
                <UserCheck className="text-[#00c2cb] h-6 w-6 mr-3" />
                <h2 className="text-xl font-medium text-gray-800">Your Choice</h2>
              </div>
              <p className="text-lg text-gray-600">
                You can stop or agree to continue. No personal identifiers are stored.
              </p>
            </div>
            
            {/* Right side: New animated consent buttons */}
            <div className="flex gap-4 items-center">
              <ConsentButton
                value={true}
                selected={consent === true}
                onClick={() => setConsent(true)}
              />
              <ConsentButton
                value={false}
                selected={consent === false}
                onClick={() => setConsent(false)}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <BackButton 
            onClick={handleBack}
            size="md"
          >
            Back
          </BackButton>

          <NextButton 
            onClick={handleNext}
            disabled={consent === null || loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Processing...</span>
              </div>
            ) : "Begin Analysis"}
          </NextButton>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
