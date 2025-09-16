"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitConsent } from "../../api/api_fingerprint_analysis";
import { useConsent } from "../../contexts/ConsentContext";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <div
      className="relative flex flex-col min-h-screen p-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, #fff 40%, #78caff 100%), linear-gradient(to bottom, transparent 60%, #78caff 100%)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Header */}
      <div className="px-10 pt-12 pb-18 flex flex-col items-center text-center">
        <h1 className="text-7xl font-bold text-[#1a3557] tracking-tight mb-2">
          Data Privacy Consent
        </h1>
        <p className="text-3xl text-[#3a4b5e] mt-4">
          Your privacy and data security are our top priority as we analyze your
          health.
        </p>
      </div>

      {/* Main Content */}
      <div className="px-10 flex flex-col gap-6">
        <div className="flex flex-row gap-6">
          {/* What We'll Analyze */}
          <div className="flex-1 bg-white border-3 border-[#75a9d7] rounded-2xl shadow p-10">
            <div className="flex items-center gap-3 mb-8">
              <i className="bi bi-file-earmark-text text-5xl text-[#3a87d5]" />
              <span className="text-6xl font-bold text-[#1a3557]">
                What We'll Analyze
              </span>
            </div>
            <div className="pl-15">
              <div className="text-3xl text-[#3a4b5e] mb-6">
                We'll analyze your fingerprints and info to provide:
              </div>
              <ul className="space-y-3 text-3xl mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-7 h-7 text-[#00b67a]" />
                  Blood type prediction
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-7 h-7 text-[#00b67a]" />
                  Diabetes risk assessment
                </li>
              </ul>
            </div>
            <div className="mt-2">
              <Alert className="bg-red-700 border-2 border-red-600 text-white backdrop-blur-md flex items-start p-4 rounded-xl shadow-lg pointer-events-auto">
                <i className="bi bi-exclamation-triangle-fill text-3xl text-white mr-3" />
                <AlertDescription className="text-white text-2xl leading-relaxed relative flex">
                  <span className="font-bold text-white mr-2">Important:</span>
                  This is a screening tool, not a diagnosis. Always consult
                  healthcare professionals.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Your Privacy */}
          <div className="flex-1 bg-white border-3 border-[#75a9d7] rounded-2xl shadow p-10">
            <div className="flex items-center gap-3 mb-8">
              <i className="bi bi-shield-lock text-5xl text-[#3a87d5]" />
              <span className="text-6xl font-bold text-[#1a3557]">
                Your Privacy
              </span>
            </div>

            <div className="flex flex-row gap-10">
              <div className="flex-1">
                <h4 className="font-semibold text-[#3a87d5] mb-2 text-3xl">
                  We Collect:
                </h4>
                <ul className="space-y-3 text-3xl">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-7 h-7 text-[#00b67a]" />
                    Basic info (age, gender, etc.)
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#ff4d6a] mb-2 text-3xl">
                  We Don't:
                </h4>
                <ul className="space-y-3 text-3xl">
                  <li className="flex items-center gap-2">
                    <XCircle className="w-7 h-7 text-[#ff4d6a]" />
                    Store personal identifiers
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-7 h-7 text-[#ff4d6a]" />
                    Share with third parties
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Consent Choice */}
        <div className="flex flex-row p-10 mt-2 items-center justify-between">
          {/* Left: Title and description */}
          <div className="flex flex-col flex-1 min-w-[320px]">
            <div className="flex items-center gap-3 mb-2">
              <i className="bi bi-person-check text-5xl text-[#3a87d5]" />
              <span className="text-5xl font-bold text-[#1a3557]">
                Your Choice
              </span>
            </div>
            <div className="text-3xl text-[#3a4b5e] mb-0">
              You can stop or agree to continue. No personal identifiers are
              stored.
            </div>
          </div>

          {/* Right: Buttons */}
          <div className="flex flex-col gap-4 ml-12">
            <div className="flex flex-row gap-6">
              <Button
                className={`flex-1 flex items-center justify-center gap-2 text-4xl font-semibold px-10 py-8 rounded-lg transition-all duration-200 ${
                  consent === true
                    ? "bg-[#3a87d5] text-white hover:bg-blue-900"
                    : "bg-[#3a87d5] text-white border-3 border-[#75a9d7] hover:bg-blue-800 shadow-xl shadow-[#3a87d5] hover:scale-105"
                }`}
                onClick={() => setConsent(true)}
              >
                <i className="bi bi-hand-thumbs-up-fill text-3xl" />I Consent
              </Button>

              <Button
                className={`flex-1 flex items-center justify-center gap-2 text-4xl font-semibold px-10 py-8 rounded-lg transition-all duration-200 ${
                  consent === false
                    ? "bg-gray-900 text-white"
                    : "bg-white text-[#1a3557] border border-[#3a87d5] hover:bg-[#e0f2ff]"
                }`}
                onClick={() => setConsent(false)}
              >
                <i className="bi bi-hand-thumbs-down-fill text-3xl" />I Do Not
                Consent
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="flex flex-row justify-between items-center">
          <Button
            className="text-4xl bg-white text-[#3a87d5] border border-[#3a87d5] hover:bg-[#e0f2ff] px-10 py-8 rounded-lg font-semibold"
            onClick={handleBack}
          >
            ← Back
          </Button>
          <div className="flex-1" />
          <Button
            onClick={handleNext}
            disabled={consent === null || loading}
            className="px-10 py-8 text-4xl flex items-center justify-center gap-2 bg-[#1a3557] text-white hover:bg-[#3a87d5] rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>{loading ? "Processing..." : "Begin Analysis"}</span>
            {!loading && <i className="bi bi-arrow-right text-3xl" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
