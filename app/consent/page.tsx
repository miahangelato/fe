"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitConsent } from "../../api/api_fingerprint_analysis";
import { useConsent } from "../../contexts/ConsentContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  FileText,
  Lock,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  TriangleAlert,
} from "lucide-react";
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
      console.error("Consent submission error:", error);
      alert("Error submitting consent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        src="/consent/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 top-30 w-full h-full object-cover z-0 rotate-180"
      />

      {/* Header */}
      <div className="relative z-10 text-center bg-[#f6f7fd] p-8 rounded-lg shadow-lg">
        {/* Icon Circle */}
        <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center bg-[#ddddf4] rounded-full shadow-md">
          <Shield className="w-8 h-8 text-[#001fa2]" />
        </div>

        <h1 className="text-5xl font-bold text-gray-800 mb-3">
          Data Privacy Consent
        </h1>
        <p className="text-xl text-gray-700 mx-auto">
          Your privacy and data security are our top priorities. Here&apos;s
          what you need to know before we begin your health analysis.
        </p>
      </div>

      {/* Page Content */}
      <div className="relative z-10 p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            {/* Quick Overview */}
            <Card className="flex-1 p-4 bg-[#f6f7fd] border border-2 border-[#001fa2]">
              <CardHeader className="mb-4">
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#ddddf4] rounded-lg shadow-md">
                    <FileText className="w-5 h-5 text-[#001fa2]" />
                  </div>
                  <span>What We&apos;ll Analyze</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-foreground text-lg">
                  We&apos;ll analyze your fingerprint patterns and basic health
                  information to provide:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="size-7 text-[#001fa2] flex-shrink-0 bg-[#ddddf4] rounded-lg" />
                    <span>Blood type prediction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="size-7 text-[#001fa2] flex-shrink-0 bg-[#ddddf4] rounded-lg" />
                    <span>Diabetes risk assessment</span>
                  </div>
                </div>

                <Alert className="relative z-10 bg-red-100 border-2 border-red-600 text-red-800 backdrop-blur-md flex items-start p-4 rounded-lg">
                  <TriangleAlert className="h-6 w-6 text-red-600 mt-1" />
                  <AlertDescription className="text-black text-base leading-relaxed relative flex">
                    <span className="font-bold text-red-900">Important:</span>{" "}
                    This is a screening tool, not a medical diagnosis. Always
                    consult healthcare professionals for medical advice.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Privacy & Data Handling */}
            <Card className="flex-1 p-4 bg-[#f6f7fd] border border-2 border-[#001fa2]">
              <CardHeader className="mb-4">
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#ddddf4] rounded-lg shadow-md">
                    <Lock className="w-5 h-5 text-[#001fa2]" />
                  </div>
                  <span>Your Privacy</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                  <div>
                    <h4 className="font-medium text-[#001fa2] mb-2 inline-block bg-[#ddddf4] px-2 rounded-lg border border-2 border-[#001fa2]">
                      We Collect:
                    </h4>

                    <ul className="space-y-1 text-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-[#001fa2] flex-shrink-0 bg-[#ddddf4] rounded-lg" />
                        Basic demographics
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-[#001fa2] flex-shrink-0 bg-[#ddddf4] rounded-lg" />
                        Fingerprint patterns
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-[#ff4d6a] mb-2 inline-block bg-[#ffe5eb] px-2 rounded-lg border border-2 border-[#ffb3c1]">
                      We Don&apos;t:
                    </h4>
                    <ul className="space-y-1 text-foreground">
                      <li className="flex items-center gap-2">
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 bg-[#fddede] rounded-lg" />
                        Store personal identifiers
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 bg-[#fddede] rounded-lg" />
                        Share with third parties
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {/* Consent Choice */}
            <Card className="p-4 bg-[#f6f7fd] border border-2 border-[#001fa2]">
              <CardHeader className="mb-4">
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#ddddf4] rounded-lg shadow-md">
                    <Shield className="w-5 h-5 text-[#001fa2]" />
                  </div>
                  <span>Your Choice</span>
                </CardTitle>
                <CardDescription className="text-lg text-foreground">
                  Please choose whether you consent to the use of your data.
                </CardDescription>
              </CardHeader>

              <Separator className="mt-4 mb-4" />

              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button
                    variant={consent === true ? "default" : "outline"}
                    className="flex-1 flex items-center justify-center gap-2 text-lg cursor-pointer"
                    onClick={() => setConsent(true)}
                  >
                    <ThumbsUp className="w-5 h-5" />I Consent
                  </Button>
                  <Button
                    variant={consent === false ? "destructive" : "outline"}
                    className="flex-1 flex items-center justify-center gap-2 text-lg cursor-pointer"
                    onClick={() => setConsent(false)}
                  >
                    <ThumbsDown className="w-5 h-5" />I Do Not Consent
                  </Button>
                </div>

                <p className="text-md text-muted-foreground text-center">
                  You can stop the process at any time. No personal identifiers
                  are stored.
                </p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-row gap-4 justify-between items-center mt-5">
              {/* Back Button */}
              <Button
                className="text-lg bg-[#ddddf4] text-[#001fa2] border border-[#001fa2] hover:bg-[#cfd5f0] flex-1 cursor-pointer"
                onClick={handleBack}
              >
                <span className="leading-none">Back</span>
              </Button>

              {/* Start Analysis Button */}
              <Button
                onClick={handleNext}
                disabled={consent === null || loading}
                className="px-4 flex-1 flex items-center justify-center gap-2 text-lg bg-[#001fa2] text-white hover:bg-[#0031a0] disabled:opacity-50 cursor-pointer"
              >
                <span className="leading-none">
                  {loading ? "Processing..." : "Begin Analysis"}
                </span>
                {!loading && <ArrowRight className="w-5 h-5 flex-shrink-0" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
