"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import EndButton from "../../components/Endbutton";
import { useConsent } from "../../contexts/ConsentContext";
// import QRCodeComponent from "../../components/QRCodeComponent";
import React from "react";
// import CryptoJS from "crypto-js";
import { ProgressHeader } from "@/components/ProgressHeader";
import {
  Droplets,
  TrendingUp,
  AlertTriangle,
  Heart,
  MapPin,
  CheckCircle,
  Info,
  User,
  Calendar,
  Ruler,
  Weight,
  Fingerprint,
  Download,
  RefreshCw,
  Sparkles,
  Zap,
  User2,
  Shield,
} from "lucide-react";
import { preventiveHealthAdvice } from "@/data/preventive";

interface DiabetesResult {
  success?: boolean;
  diabetes_risk?: string;
  confidence?: number;
  saved?: boolean;
  participant_id?: number;
  result_id?: number;
  features_used?: string[];
  prediction_details?: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    blood_type: string;
    fingerprint_count: number;
  };
  participant_data?: any;
  fingerprints?: any[];
}

interface BloodGroupResult {
  success?: boolean;
  results?: Array<{
    finger: string;
    image_name: string;
    predicted_blood_group: string;
    confidence: number;
    all_probabilities: Record<string, number>;
  }>;
  predicted_blood_group?: string;
  blood_group?: string;
  confidence?: number;
  saved?: boolean;
  participant_id?: number;
  result_id?: number;
  features_used?: string[];
  prediction_details?: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    blood_type: string;
    fingerprint_count: number;
  };
  participant_data?: any;
  fingerprints?: any[];
}

export default function ResultPage() {
  const {
    diabetesResult,
    bloodGroupResult: contextBloodGroupResult,
    participantData: contextParticipantData,
  } = useConsent();
  const [result, setResult] = useState<DiabetesResult | null>(null);
  const [bloodGroupResult, setBloodGroupResult] =
    useState<BloodGroupResult | null>(null);
  const [participantData, setParticipantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sessionId: string | null = null;

    // First check if data is available from sessionStorage via session ID
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      sessionId = urlParams.get("sid") || urlParams.get("s");

      // Also try to get from stored session ID if no URL parameter
      if (!sessionId) {
        sessionId = sessionStorage.getItem("current_session_id");
      }

      if (sessionId) {
        try {
          // Try the new enhanced storage system first
          let encodedData = sessionStorage.getItem(sessionId);

          // Fallback to the fixed key storage
          if (!encodedData) {
            encodedData = sessionStorage.getItem("health_results_data");
          }

          if (encodedData) {
            const dataString = atob(encodedData); // Base64 decoding
            const dataWithExpiry = JSON.parse(dataString);

            // Check if data has expired
            if (Date.now() > dataWithExpiry.expiry) {
              sessionStorage.removeItem(sessionId);
              sessionStorage.removeItem("health_results_data");
              sessionStorage.removeItem("current_session_id");
              setLoading(false);
              // Clean the URL
              window.history.replaceState({}, "", "/result");
              return;
            }

            const decodedData = dataWithExpiry.data;
            setResult(decodedData.diabetesResult);
            setBloodGroupResult(decodedData.bloodGroupResult);
            setParticipantData(decodedData.participantData);
            setLoading(false);

            // Clean the URL after loading data successfully
            window.history.replaceState({}, "", "/result");
            console.log("Results loaded successfully from session storage");
            return;
          }
        } catch (error) {
          console.error("Error parsing session data:", error);
          // Clean the URL on error
          window.history.replaceState({}, "", "/result");
          sessionStorage.removeItem("current_session_id");
        }
      }
    }

    // Fallback to context data
    if (diabetesResult && contextBloodGroupResult) {
      setResult(diabetesResult);
      setBloodGroupResult(contextBloodGroupResult);
      setParticipantData(contextParticipantData);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [diabetesResult, contextBloodGroupResult, contextParticipantData]);

  // Generate download URL for QR code
  const generateDownloadUrl = () => {
    if (!participantData || !result || !bloodGroupResult) return "";

    const highestConfidenceResult = bloodGroupResult?.results?.reduce(
      (best: any, current: any) => {
        return current.confidence > (best?.confidence || 0) ? current : best;
      },
      null
    );

    const predictedBloodGroup = highestConfidenceResult?.predicted_blood_group;
    const bloodGroupConfidence = highestConfidenceResult?.confidence;

    // Create downloadable data in a structured format
    const downloadData = {
      participantInfo: {
        age: participantData.age || result.prediction_details?.age,
        gender: participantData.gender || result.prediction_details?.gender,
        height: participantData.height || result.prediction_details?.height,
        weight: participantData.weight || result.prediction_details?.weight,
        bloodType:
          participantData.blood_type || result.prediction_details?.blood_type,
        willingToDonate: participantData.willing_to_donate,
      },
      analysisResults: {
        diabetesRisk: result.diabetes_risk,
        diabetesConfidence: result.confidence
          ? (result.confidence * 100).toFixed(1) + "%"
          : "N/A",
        predictedBloodGroup: predictedBloodGroup || "Unknown",
        bloodGroupConfidence: bloodGroupConfidence
          ? (bloodGroupConfidence * 100).toFixed(1) + "%"
          : "N/A",
      },
      metadata: {
        participantId: result.participant_id,
        resultId: result.result_id,
        generatedDate: new Date().toISOString(),
        saved: result.saved,
      },
    };

    // Convert to base64 for URL encoding
    const dataString = JSON.stringify(downloadData, null, 2);
    const encodedData = btoa(dataString);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `health_results_${
      participantData.participant_id || "anonymous"
    }_${timestamp}`;

    // Create the download URL - this should work in production
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin.includes("localhost")
          ? "https://your-production-domain.com" // Replace with your actual production domain
          : window.location.origin
        : "https://your-production-domain.com"; // Replace with your actual production domain

    return `${baseUrl}/api/download-data?format=json&data=${encodedData}&filename=${filename}`;
  };

  // Alternative: Generate PDF download URL if you have the PDF API endpoint
  const generatePDFDownloadUrl = () => {
    if (!participantData?.participant_id) return "";

    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin.includes("localhost")
          ? "https://your-production-domain.com" // Replace with your actual production domain
          : window.location.origin
        : "https://your-production-domain.com"; // Replace with your actual production domain

    const sessionId =
      typeof window !== "undefined"
        ? sessionStorage.getItem("current_session_id")
        : "";

    return `${baseUrl}/api/download/${participantData.participant_id}?sessionId=${sessionId}&format=pdf`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading result...</div>
      </div>
    );
  }

  if (!result || !bloodGroupResult || !participantData) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Results</h1>
        <div className="bg-white border rounded-lg shadow-lg p-6 text-center">
          <div className="text-gray-500 mb-4">
            No result found. Please submit your data first.
          </div>
          <button
            onClick={() =>
              (window.location.href = "/fingerprint_analysis?consent=true")
            }
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go Back to Analysis
          </button>
        </div>
      </div>
    );
  }

  const highestConfidenceResult = bloodGroupResult?.results?.reduce(
    (best: any, current: any) => {
      return current.confidence > (best?.confidence || 0) ? current : best;
    },
    null
  );

  const predictedBloodGroup = highestConfidenceResult?.predicted_blood_group;
  const bloodGroupConfidence = highestConfidenceResult?.confidence;

  // Get the appropriate download URL
  const downloadUrl = generatePDFDownloadUrl() || generateDownloadUrl();

  const isDiabetic =
    result.diabetes_risk?.toLowerCase() === "diabetic" ||
    result.diabetes_risk?.toLowerCase() === "high" ||
    result.diabetes_risk?.toLowerCase() === "at risk";

  // Normalize diabetes risk for display
  const displayDiabetesRisk = (() => {
    if (!result.diabetes_risk) return "Unknown";

    const risk = result.diabetes_risk.toLowerCase();

    if (risk === "diabetic") return "At Risk";
    if (risk === "high") return "At Risk";
    if (risk === "at risk") return "At Risk";

    return result.diabetes_risk;
  })();

  return (
    <div className="flex flex-col">
      {/* Progress Header */}
      <ProgressHeader
        currentStep={4}
        totalSteps={4}
        title="Results & Recommendations"
        subtitle="Your fingerprint analysis results and health insights"
      />
      
      <div
        className="min-h-screen flex"
        style={{
          background:
            "linear-gradient(120deg, #fff 40%, #78caff 100%), linear-gradient(to bottom, transparent 60%, #78caff 100%)",
          backgroundBlendMode: "overlay",
        }}
      >
      {/* SIDEBAR */}
      <aside className="w-[360px] shrink-0 h-screen bg-white rounded-sm p-6 shadow-xl border-4 border-slate-200 shadow-slate-300 overflow-y-auto sticky top-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <p className="text-4xl text-blue-600 font-extrabold">
                Preventive Health Tips
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <Zap className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <ul className="list-disc list-inside text-gray-700 text-xl space-y-2">
          {preventiveHealthAdvice.map((item, idx) => (
            <li key={idx}>{item.advice}</li>
          ))}
        </ul>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <div>
              <p className="text-3xl font-semibold text-blue-700">
                Remember: Prevention is better than cure
              </p>
              <p className="text-lg text-blue-800 mt-2">
                Regular check-ups and a healthy lifestyle can make a big
                difference.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 items-center mb-5 justify-center text-center">
          <h1 className="text-7xl font-bold">Health Analysis Results</h1>
          <p className="text-xl text-gray-600">
            Review your predicted health metrics and risks below.
          </p>
        </div>

        {/* First - QR + Participant Info Card */}
        <div className="flex flex-row gap-6 p-6 mb-15 bg-white rounded-xl shadow-lg border-2 border-slate-200">
          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center w-48">
            <h2 className="text-xl font-bold text-gray-800">
              Download Results
            </h2>
            {downloadUrl && (
              <QRCodeSVG
                value={downloadUrl}
                size={175}
                level="M"
                includeMargin={true}
                className="mx-auto"
              />
            )}
          </div>

          {/* Participant Information */}
          <div className="flex-1">
            <div className="flex items-center mb-6">
              <User className="w-8 h-8 text-slate-600" />
              <h3 className="text-4xl font-extrabold text-slate-800 ml-2">
                Participant Information
              </h3>
            </div>

            <div className="grid grid-cols-6 gap-4 text-center">
              {/* Age */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Calendar className="w-6 h-6 text-slate-900" />
                  <span className="text-2xl font-bold text-slate-900">Age</span>
                </div>
                <div className="text-2xl font-semibold text-slate-800">
                  {result.prediction_details?.age ||
                    result.participant_data?.age ||
                    "47"}{" "}
                  yrs
                </div>
              </div>

              {/* Gender */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <User className="w-6 h-6 text-slate-900" />
                  <span className="text-2xl font-bold text-slate-900">
                    Gender
                  </span>
                </div>
                <div className="text-2xl font-semibold text-slate-800">
                  {result.prediction_details?.gender ||
                    result.participant_data?.gender ||
                    "Male"}
                </div>
              </div>

              {/* Height */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Ruler className="w-6 h-6 text-slate-900" />
                  <span className="text-2xl font-bold text-slate-900">
                    Height
                  </span>
                </div>
                <div className="text-2xl font-semibold text-slate-800">
                  {result.prediction_details?.height ||
                    result.participant_data?.height ||
                    "162"}{" "}
                  cm
                </div>
              </div>

              {/* Weight */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Weight className="w-6 h-6 text-slate-900" />
                  <span className="text-2xl font-bold text-slate-900">
                    Weight
                  </span>
                </div>
                <div className="text-2xl font-semibold text-slate-800">
                  {result.prediction_details?.weight ||
                    result.participant_data?.weight ||
                    "100"}{" "}
                  kg
                </div>
              </div>

              {/* Blood Type */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Heart className="w-6 h-6 text-slate-900" />
                  <span className="text-2xl font-bold text-slate-900">
                    Blood Type
                  </span>
                </div>
                <div className="text-2xl font-semibold text-slate-800">
                  {result.prediction_details?.blood_type ||
                    result.participant_data?.blood_type ||
                    "B"}
                </div>
              </div>

              {/* Fingerprints */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Fingerprint className="w-6 h-6 text-slate-900" />
                  <span className="text-2xl font-bold text-slate-900">
                    Fingerprints
                  </span>
                </div>
                <div className="text-2xl font-semibold text-slate-800">
                  {result.prediction_details?.fingerprint_count ||
                    result.fingerprints?.length ||
                    "10"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second - Predictions */}
        <div className="grid grid-cols-4 gap-6 mb-15">
          {/* Titles */}
          <div className="flex flex-row gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Droplets className="w-10 h-10 text-blue-600" />{" "}
            </div>
            <p className="text-4xl text-blue-600 font-extrabold">
              Predicted Blood Type
            </p>
          </div>

          <div className="flex flex-col text-center">
            <p className="text-4xl text-blue-600 font-extrabold">Confidence</p>
          </div>

          <div className="flex flex-row gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <TrendingUp
                className={`w-8 h-8 ${
                  isDiabetic ? "text-red-600" : "text-green-600"
                }`}
              />
            </div>
            <p
              className={`text-4xl font-extrabold ${
                isDiabetic ? "text-red-600" : "text-green-600"
              }`}
            >
              Predicted Diabetes Risk
            </p>
          </div>

          <div className="flex flex-col text-center">
            <p className="text-4xl text-red-600 font-extrabold">Confidence</p>
          </div>

          {/* Results */}
          <div className="flex flex-col items-center justify-center text-6xl font-bold text-blue-600">
            {predictedBloodGroup || "B-"}
          </div>

          <div className="flex flex-col items-center justify-center text-6xl font-bold text-blue-600">
            {(bloodGroupConfidence
              ? (bloodGroupConfidence * 100).toFixed(1)
              : "100.0") + "%"}
          </div>

          <div className="flex flex-col items-center justify-center pr-16 text-6xl font-bold">
            <span
              className={`${isDiabetic ? "text-red-600" : "text-green-600"}`}
            >
              {displayDiabetesRisk.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-6xl font-bold">
            <span
              className={`${isDiabetic ? "text-red-600" : "text-green-600"}`}
            >
              {(result.confidence
                ? (result.confidence * 100).toFixed(1)
                : "100.0") + "%"}
            </span>
          </div>
        </div>

        {/* Third - Hospitals and Dono */}
        <div className="flex flex-row gap-4 mb-7">
          {/* Health Notice / Healthy */}
          {isDiabetic ? (
            <div className="p-6 bg-white rounded-xl border-l-4 border-slate-500 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-slate-800" />
                </div>
                <h3 className="text-4xl font-extrabold text-slate-800">
                  Important Health Notice
                </h3>
              </div>
              <p className="text-gray-700 mb-6 text-xl leading-relaxed">
                Your results show elevated diabetes risk. Please consult a
                healthcare professional for proper evaluation and advice.
              </p>
              <button
                onClick={() => (window.location.href = "/hospitals")}
                className="cursor-pointer w-full bg-blue-600 text-2xl text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-bold inline-flex items-center justify-center space-x-2"
              >
                <MapPin className="w-6 h-6" />
                <span>Find Nearby Hospitals</span>
              </button>
            </div>
          ) : (
            <div className="p-6 bg-white rounded-xl border-l-4 border-green-500 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-4xl font-extrabold text-green-800">
                  You're Healthy!
                </h3>
              </div>
              {participantData?.willing_to_donate === true ? (
                <div>
                  <p className="text-gray-700 mb-6 text-xl leading-relaxed">
                    Great news! You're healthy and willing to donate blood. Help
                    save lives by donating blood to those in need.
                  </p>
                  <button
                    onClick={() =>
                      (window.location.href = "/blood-donation-centers")
                    }
                    className="w-full bg-green-600 text-white text-2xl px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold inline-flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-6 h-6" />
                    <span>Find Blood Donation Centers</span>
                  </button>
                </div>
              ) : participantData?.willing_to_donate === false ? (
                <div>
                  <p className="text-gray-700 mb-6 text-xl leading-relaxed">
                    You are healthy! Consider blood donation to help save lives.
                  </p>
                  <button
                    onClick={() =>
                      (window.location.href = "/blood-donation-centers")
                    }
                    className="w-full bg-green-600 text-white text-2xl px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    View Blood Donation Centers
                  </button>
                </div>
              ) : (
                <p className="text-gray-700 text-xl leading-relaxed">
                  You are healthy! Please indicate if you're willing to donate
                  blood.
                </p>
              )}
            </div>
          )}

          {/* NEW: Blood Donation Interest for diabetic but willing */}
          {isDiabetic && participantData?.willing_to_donate === true && (
            <div className="p-6 bg-white rounded-xl border-l-4 border-slate-500 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-4xl font-extrabold text-slate-800">
                  Blood Donation Interest
                </h3>
              </div>
              <p className="text-gray-700 mb-6 text-xl leading-relaxed">
                Thank you for your willingness to donate. Check with your
                healthcare provider to confirm eligibility.
              </p>
              <button
                onClick={() =>
                  (window.location.href = "/blood-donation-centers")
                }
                className="w-full bg-red-700 text-white text-xl px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-bold inline-flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Heart className="w-6 h-6" />
                <span>View Blood Donation Centers</span>
              </button>
            </div>
          )}

          {/* Data Storage Status */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-500 shadow-blue-200">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              <i className="bi bi-database-fill text-4xl text-blue-600 mr-2" />
              Data Storage Status
            </h3>
            <div
              className={`p-4 rounded-lg flex items-start space-x-3 ${
                result.saved
                  ? "bg-green-50 border border-green-200"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="mt-0.5">
                {result.saved ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <Info className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <h4
                  className={`font-semibold text-2xl ${
                    result.saved ? "text-green-800" : "text-blue-800"
                  }`}
                >
                  {result.saved ? "Data Saved Securely" : "Privacy Protected"}
                </h4>
                <p
                  className={`text-xl mt-1 ${
                    result.saved ? "text-green-700" : "text-blue-700"
                  }`}
                >
                  {result.saved
                    ? "Your anonymized data is stored securely."
                    : "Your data was analyzed but not stored for privacy protection."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() =>
              (window.location.href = "/fingerprint_analysis?consent=true")
            }
            className="text-3xl px-5 py-3 bg-white rounded-xl text-[#3a87d5] border border-[#3a87d5] hover:bg-[#e0f2ff] font-medium inline-flex items-center space-x-2 cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            <span>New Analysis</span>
          </button>
          <EndButton />
        </div>
      </main>
      </div>
    </div>
  );
}
