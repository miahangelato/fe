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
import {
  Fingerprint,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HandGuide } from "@/components/HandGuide";

// Single Fingerprint Card Component
function SingleFingerprintCard({
  fingerFiles,
  onScanComplete,
  onFileChange,
}: {
  fingerFiles: { [key in FingerName]?: File };
  onScanComplete: (fingerName: FingerName, file: File) => void;
  onFileChange: (finger: FingerName, file: File | null) => void;
}) {
  const [currentFingerIndex, setCurrentFingerIndex] = useState(0);
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
    <div className="grid grid-cols-3 gap-4">
      {/* Left - Scan Area */}
      <Card className="col-span-2 p-4 shadow-sm border rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-bold justify-center flex items-center mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm mr-2">
              {currentFingerIndex + 1} of {totalFingers}
            </span>
            {handRaw.charAt(0).toUpperCase() + handRaw.slice(1)}{" "}
            {fingerRaw.charAt(0).toUpperCase() + fingerRaw.slice(1)}
          </CardTitle>
          <div className="text-lg text-gray-500">
            Progress {Object.keys(fingerFiles).length}/{totalFingers}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-6">
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-64 h-64 flex items-center justify-center bg-gray-50 rounded-2xl border">
                <HandGuide hand={hand} highlightFinger={highlight} />
              </div>

              <FingerprintScanner
                onScanComplete={handleScanCompleteWithAdvance}
                currentFinger={currentFinger}
              />
            </div>

            {isScanned && (
              <div className="flex flex-col items-center">
                <img
                  src={URL.createObjectURL(fingerFiles[currentFinger]!)}
                  alt={currentFinger}
                  className="w-40 h-40 object-contain border-2 border-blue-400 rounded-lg shadow"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFileChange(currentFinger, null)}
                  className="mt-3 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Rescan
                </Button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={handlePrevious}
              disabled={currentFingerIndex === 0}
              className="rounded-full cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex gap-2">
              {FINGER_ORDER.map((finger, index) => {
                const isCompleted = !!fingerFiles[finger];
                const isCurrent = index === currentFingerIndex;
                return (
                  <button
                    type="button"
                    key={finger}
                    onClick={() => handleGoToFinger(index)}
                    disabled={!isCompleted && index > currentFingerIndex}
                    className={`w-9 h-9 text-xs rounded-md font-medium border transition-all
                    ${
                      isCurrent
                        ? "bg-blue-500 text-white border-blue-500"
                        : isCompleted
                        ? "bg-blue-100 text-blue-600 border-blue-300"
                        : "bg-gray-100 text-gray-400 border-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={handleNext}
              disabled={!isScanned || currentFingerIndex === totalFingers - 1}
              className="rounded-full cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right - Upload + Progress */}
      <div className="flex flex-col gap-4">
        <Card className="p-4 shadow-sm border rounded-2xl">
          <CardTitle className="text-xl font-bold mb-3">
            Upload Alternative
          </CardTitle>
          <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 transition hover:scale-95">
            <Upload className="w-6 h-6 text-blue-400 mb-2" />
            <span className="text-sm text-gray-600">Upload File</span>
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
        </Card>

        <Card className="p-4 shadow-sm border rounded-2xl">
          <CardTitle className="text-2xl font-bold mb-2">
            Scan Progress
          </CardTitle>
          <div className="text-lg text-gray-600 mb-2">
            Overall Progress {Object.keys(fingerFiles).length}/{totalFingers}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{
                width: `${
                  (Object.keys(fingerFiles).length / totalFingers) * 100
                }%`,
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {/* Left Hand */}
            <div>
              {FINGER_ORDER.filter((f) => f.startsWith("left")).map(
                (finger) => (
                  <div
                    key={finger}
                    className={`flex items-center text-lg ${
                      fingerFiles[finger] ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={finger === currentFinger}
                      readOnly
                      className="mr-2 accent-blue-500"
                    />
                    {finger.replace("_", " ").toUpperCase()}
                  </div>
                )
              )}
            </div>

            {/* Right Hand */}
            <div>
              {FINGER_ORDER.filter((f) => f.startsWith("right")).map(
                (finger) => (
                  <div
                    key={finger}
                    className={`flex items-center text-lg ${
                      fingerFiles[finger] ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={finger === currentFinger}
                      readOnly
                      className="mr-2 accent-blue-500"
                    />
                    {finger.replace("_", " ").toUpperCase()}
                  </div>
                )
              )}
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
  const handleClearAll = () => setFingerFiles({});

  if (!participant) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p>Loading form data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Background Video */}
      <video
        src="/fprint-anal/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover -z-1 opacity-10 rotate-180"
      />

      {/* Header */}
      <div className="flex items-center mb-6 justify-center">
        <Fingerprint className="w-14 h-14 text-blue-500 mr-2" />
        <div>
          <h1 className="text-5xl font-bold">Biometric Analysis</h1>
          <p className="text-xl text-gray-900">
            Secure fingerprint scanning system
          </p>
        </div>
      </div>

      {/* Participant Info */}
      <Card className="mb-6 border rounded-2xl shadow-sm">
        <CardContent className="grid grid-cols-6 gap-4 p-4 text-lg">
          <div>
            <strong>AGE</strong>
            <br />
            {participant.age}
          </div>
          <div>
            <strong>GENDER</strong>
            <br />
            {participant.gender}
          </div>
          <div>
            <strong>HEIGHT</strong>
            <br />
            {participant.height} cm
          </div>
          <div>
            <strong>WEIGHT</strong>
            <br />
            {participant.weight} kg
          </div>
          <div>
            <strong>BLOOD</strong>
            <br />
            {participant.blood_type}
          </div>
          <div>
            <strong>DONOR</strong>
            <br />
            {willingToDonate ? "Yes" : "No"}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <SingleFingerprintCard
          fingerFiles={fingerFiles}
          onScanComplete={handleScanComplete}
          onFileChange={handleFileChange}
        />

        {/* Bottom Buttons */}
        <div className="flex justify-between mt-5">
          <Button
            type="button"
            onClick={handleBack}
            variant="outline"
            className="px-8 text-3xl py-6 font-bold bg-black text-white cursor-pointer"
          >
            Back
          </Button>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={
                submitting ||
                Object.keys(fingerFiles).length !== FINGER_ORDER.length
              }
              className={`px-6 py-2 rounded-lg text-white text-xl font-bold ${
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
                  })`}
            </button>

            <button
              type="button"
              onClick={handleClearAll}
              disabled={submitting}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xl px-6 py-2 rounded-lg cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
