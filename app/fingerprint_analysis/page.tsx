"use client";
import { useState, useEffect } from "react";
// import { useFingerprintAnalysis } from "../../hooks/useFingerPrintAnalysis";
import {
  buildFingerprintFormData,
  predictBloodGroupFromSubmitData,
  predictBloodGroup,
  submitFingerprintAnalysis,
  predictDiabetesFromSubmitData,
  predictDiabetesRisk,
} from "../../api/api_fingerprint_analysis";
import { useConsent } from "../../contexts/ConsentContext";
import { ParticipantData } from "../../types/participant";
import { FingerName, FINGER_ORDER } from "../../types/fingerprint";
import FingerprintScanner from "../../components/FingerprintScanner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressHeader } from "@/components/ProgressHeader";
import {
  Fingerprint,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Upload,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HandGuide } from "@/components/HandGuide";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Single Fingerprint Card Component
function SingleFingerprintCard({
  fingerFiles,
  onScanComplete,
  onFileChange,
  participant,
  willingToDonate,
  currentFingerIndex,
  setCurrentFingerIndex,
}: {
  fingerFiles: { [key in FingerName]?: File };
  onScanComplete: (fingerName: FingerName, file: File) => void;
  onFileChange: (finger: FingerName, file: File | null) => void;
  participant: ParticipantData;
  willingToDonate: boolean | null;
  currentFingerIndex: number;
  setCurrentFingerIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const currentFinger = FINGER_ORDER[currentFingerIndex];
  const [handRaw, fingerRaw] = currentFinger.split("_");
  const hand = handRaw as "right" | "left";
  const highlight = fingerRaw as
    | "thumb"
    | "index"
    | "middle"
    | "ring"
    | "pinky";
  const isScanned = !!fingerFiles[currentFinger];
  const totalFingers = FINGER_ORDER.length;

  const handleNext = () => {
    if (!isScanned) return;
    if (currentFingerIndex < totalFingers - 1) {
      setCurrentFingerIndex(currentFingerIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentFingerIndex > 0) {
      setCurrentFingerIndex(currentFingerIndex - 1);
    }
  };

  const handleGoToFinger = (index: number) => {
    setCurrentFingerIndex(index);
  };

  const handleScanCompleteWithAdvance = (
    fingerName: FingerName,
    file: File
  ) => {
    onScanComplete(fingerName, file);
    setTimeout(() => {
      for (let i = currentFingerIndex + 1; i < totalFingers; i++) {
        if (!fingerFiles[FINGER_ORDER[i]]) {
          setCurrentFingerIndex(i);
          break;
        }
      }
    }, 500);
  };

  return (
    <div className="flex flex-col">
      {/* Progress Header */}
      <ProgressHeader
        currentStep={3}
        totalSteps={4}
        title="Fingerprint Scan & Analysis"
        subtitle="Please follow the instructions to scan your fingerprints"
      />
      
      <div className="grid grid-cols-3 gap-4 p-4">
      {/* Left - Scan Area */}
      <Card className="col-span-2 p-4 shadow-xl border-3 border-[#75a9d7] rounded-2xl shadow-[#75a9d7] items-center justify-center">
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle className="text-4xl font-bold justify-center flex items-center">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-3xl mr-2">
              {currentFingerIndex + 1} of {totalFingers}
            </span>
            {handRaw.charAt(0).toUpperCase() + handRaw.slice(1)}{" "}
            {fingerRaw.charAt(0).toUpperCase() + fingerRaw.slice(1)}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-6 justify-center">
          <div className="flex flex-row items-center gap-4 mt-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-94 h-94 flex items-center justify-center bg-gray-50 rounded-2xl border">
                <HandGuide hand={hand} highlightFinger={highlight} />
              </div>

              <div className="flex items-center gap-4">
                <FingerprintScanner
                  onScanComplete={handleScanCompleteWithAdvance}
                  currentFinger={currentFinger}
                />

                {/* Upload Button beside scanner - Hide it when not usable anymore!!! */}
                <div className="flex flex-col items-center">
                  <label className="flex flex-row gap-2 items-center justify-center border-3 border-[#75a9d7] border-dashed rounded-xl cursor-pointer hover:bg-blue-50 transition hover:scale-95 p-4">
                    <Upload className="w-8 h-8 text-blue-400 mb-2" />
                    <span className="text-xl text-gray-600 text-center">
                      Upload Alternative
                    </span>
                    <input
                      id="hidden-scan-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onFileChange(currentFinger, file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Scanned Image Display or Placeholder */}
            <div className="flex flex-col items-center">
              {isScanned ? (
                <>
                  <img
                    src={URL.createObjectURL(fingerFiles[currentFinger]!)}
                    alt={currentFinger}
                    className="w-60 h-60 object-contain border-2 border-blue-400 rounded-lg shadow"
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => onFileChange(currentFinger, null)}
                    className="mt-3 flex items-center gap-2 cursor-pointer text-3xl py-6"
                  >
                    <RotateCcw className="w-8 h-8" />
                    Rescan
                  </Button>
                </>
              ) : (
                <div className="w-60 h-60 flex items-center text-center justify-center border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 text-blue-400 text-xl font-medium shadow-inner">
                  Fingerprint preview will appear here
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6 mt-4">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handlePrevious}
              disabled={currentFingerIndex === 0}
              className="rounded-md cursor-pointer py-8 px-4 text-3xl bg-[#1a3557] hover:bg-[#3a87d5] text-white flex items-center justify-center gap-2"
            >
              <i className="bi bi-arrow-left text-3xl" /> Previous
            </Button>

            <div className="text-3xl font-semibold text-gray-700">
              Step {currentFingerIndex + 1} of {totalFingers}
            </div>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleNext}
              disabled={!isScanned || currentFingerIndex === totalFingers - 1}
              className="rounded-md cursor-pointer py-8 px-4 text-3xl bg-[#1a3557] hover:bg-[#3a87d5] text-white flex items-center justify-center gap-2"
            >
              Next <i className="bi bi-arrow-right text-3xl" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right - Instructions and Participant Info */}
      <div className="flex flex-col gap-4">
        <Card className="p-6 shadow-sm border-3 border-[#75a9d7] rounded-2xl">
          <CardTitle className="text-4xl font-bold text-slate-800 mb-6">
            Scanning Instructions
          </CardTitle>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
              <i className="bi bi-1-circle-fill text-4xl text-blue-600 mt-1" />
              <div>
                <p className="text-3xl font-semibold text-gray-800">
                  Clean your finger
                </p>
                <p className="text-2xl text-gray-500">
                  Ensure finger is clean and dry
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
              <i className="bi bi-2-circle-fill text-4xl text-blue-600 mt-1" />
              <div>
                <p className="text-3xl font-semibold text-gray-800">
                  Position correctly
                </p>
                <p className="text-2xl text-gray-500">
                  Place finger flat on the scanner
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
              <i className="bi bi-3-circle-fill text-4xl text-blue-600 mt-1" />
              <div>
                <p className="text-3xl font-semibold text-gray-800">
                  Hold steady
                </p>
                <p className="text-2xl text-gray-500">
                  Keep finger still during scan
                </p>
              </div>
            </div>
          </div>

          {/* Tip Section */}
          <div className="text-xl text-gray-600 mt-2">
            <span className="font-bold">Tip:</span> If scanning fails, try
            adjusting finger pressure or cleaning the scanner surface.
          </div>
        </Card>

        <Card className="p-6 shadow-lg border-0 rounded-3xl bg-gradient-to-br from-blue-50 to-white">
          {/* Participant Info Header */}
          <CardTitle className="flex items-center gap-3 text-4xl font-bold text-slate-800 mb-6">
            Participant Information
          </CardTitle>

          {/* Participant Info Grid */}
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <i className="bi bi-person text-blue-500 text-xl"></i>
              </div>
              <div>
                <div className="text-xl text-gray-500 font-medium">Age:</div>
                <div className="text-xl font-semibold text-gray-800">
                  {participant.age}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <i className="bi bi-gender-ambiguous text-blue-500 text-xl"></i>
              </div>
              <div>
                <div className="text-xl text-gray-500 font-medium">Gender:</div>
                <div className="text-xl font-semibold text-gray-800">
                  {participant.gender}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <i className="bi bi-rulers text-blue-500 text-xl"></i>
              </div>
              <div>
                <div className="text-xl text-gray-500 font-medium">Height:</div>
                <div className="text-xl font-semibold text-gray-800">
                  {participant.height} cm
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <i className="bi bi-speedometer text-blue-500 text-xl"></i>
              </div>
              <div>
                <div className="text-xl text-gray-500 font-medium">Weight:</div>
                <div className="text-xl font-semibold text-gray-800">
                  {participant.weight} kg
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <i className="bi bi-droplet text-blue-500 text-xl"></i>
              </div>
              <div>
                <div className="text-xl text-gray-500 font-medium">Blood:</div>
                <div className="text-xl font-semibold text-gray-800">
                  {participant.blood_type}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <i className="bi bi-heart text-blue-500 text-xl"></i>
              </div>
              <div>
                <div className="text-xl text-gray-500 font-medium">Donor:</div>
                <div className="text-xl font-semibold text-gray-800">
                  {willingToDonate ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// OG FUNCTION
export default function FingerprintScanPage() {
  const {
    hasConsent,
    navigateToResultsWithData,
    retrieveFormData,
    clearFormData,
  } = useConsent();

  const router = useRouter();
  const [currentFingerIndex, setCurrentFingerIndex] = useState(0);
  const [participant, setParticipant] = useState<ParticipantData | null>(null);
  const [willingToDonate, setWillingToDonate] = useState<boolean | null>(null);
  const [fingerFiles, setFingerFiles] = useState<{
    [key in FingerName]?: File;
  }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const savedFormData = retrieveFormData();
    if (savedFormData && savedFormData.completed) {
      setParticipant(savedFormData.participant);
      setWillingToDonate(savedFormData.willingToDonate);
    } else {
      router.push("/personal-info");
    }
  }, [retrieveFormData, router]);

  const handleFileChange = (finger: FingerName, file: File | null) => {
    // Prevent duplicate file upload for different fingers
    if (
      file &&
      Object.entries(fingerFiles).some(
        ([key, f]) =>
          key !== finger && f && f.name === file.name && f.size === file.size
      )
    ) {
      alert("This image has already been uploaded for another finger.");
      return;
    }
    setFingerFiles((prev) => ({ ...prev, [finger]: file || undefined }));
  };

  const handleScanComplete = (fingerName: FingerName, file: File) => {
    handleFileChange(fingerName, file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!participant) {
      alert("Participant data not found.");
      router.push("/personal-info");
      return;
    }
    if (Object.keys(fingerFiles).length === 0) {
      alert("Please scan at least one fingerprint.");
      return;
    }

    try {
      setSubmitting(true);
      const consentString = hasConsent ? "true" : "false";
      const formData = buildFingerprintFormData(
        participant,
        fingerFiles,
        consentString,
        willingToDonate === null ? undefined : willingToDonate
      );

      const submitRes = await submitFingerprintAnalysis(formData);
      if (hasConsent && submitRes.saved && submitRes.participant_id) {
        const predictionResult = await predictDiabetesRisk(
          submitRes.participant_id.toString(),
          true,
          formData
        );
        const bloodGroupResult = await predictBloodGroup(
          submitRes.participant_id.toString(),
          true
        );
        clearFormData();
        navigateToResultsWithData(predictionResult, bloodGroupResult, {
          ...participant,
          willing_to_donate: willingToDonate,
        });
      } else {
        const predictionResult = await predictDiabetesFromSubmitData(submitRes);
        const bloodGroupResult = await predictBloodGroupFromSubmitData(
          submitRes,
          fingerFiles
        );
        clearFormData();
        navigateToResultsWithData(predictionResult, bloodGroupResult, {
          ...participant,
          willing_to_donate: willingToDonate,
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => router.back();
  const handleClearAll = () => {
    setFingerFiles({});
    setCurrentFingerIndex(0);
  };

  if (!participant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Loading form data...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background:
          "linear-gradient(120deg, #fff 40%, #78caff 100%), linear-gradient(to bottom, transparent 60%, #78caff 100%)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Header */}
      <div className="flex items-center mb-10 justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-bold">Biometric Analysis</h1>
          <p className="text-3xl text-gray-900">
            Secure fingerprint scanning system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <SingleFingerprintCard
          fingerFiles={fingerFiles}
          onScanComplete={handleScanComplete}
          onFileChange={handleFileChange}
          participant={participant}
          willingToDonate={willingToDonate}
          currentFingerIndex={currentFingerIndex}
          setCurrentFingerIndex={setCurrentFingerIndex}
        />

        {/* Bottom Buttons */}
        <div className="flex justify-between mt-5">
          <Button
            className="text-4xl bg-white text-[#3a87d5] border border-[#3a87d5] hover:bg-[#e0f2ff] px-10 py-8 rounded-lg font-semibold"
            onClick={handleBack}
          >
            ← Back
          </Button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleClearAll}
              disabled={submitting}
              className="bg-red-700 hover:bg-red-600 text-white font-semibold text-3xl px-6 py-2 rounded-lg cursor-pointer"
            >
              <i className="bi bi-trash3-fill text-2xl mr-2" />
              Clear All
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                Object.keys(fingerFiles).length !== FINGER_ORDER.length
              }
              className={`px-6 py-2 rounded-lg text-white text-4xl font-bold ${
                submitting ||
                Object.keys(fingerFiles).length !== FINGER_ORDER.length
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              }`}
            >
              {submitting
                ? "Processing..."
                : `Submit Analysis (${Object.keys(fingerFiles).length}/${
                    FINGER_ORDER.length
                  }) →`}
            </button>
          </div>
        </div>
      </form>

      {/* Loader Overlay */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-6">
            <Loader2 className="w-16 h-16 text-white animate-spin" />
            <Alert className="bg-red-700 border-2 border-red-600 text-white backdrop-blur-md flex items-start p-4 rounded-xl shadow-lg pointer-events-auto">
              <i className="bi bi-exclamation-triangle-fill text-4xl text-white mr-3" />
              <AlertDescription className="text-white text-3xl relative flex">
                <span className="font-bold text-white mr-2">Important:</span>
                This is a screening tool, not a diagnosis. Always consult
                healthcare professionals.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
