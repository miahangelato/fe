"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import EndButton from "../../components/Endbutton";
import { useConsent } from "../../contexts/ConsentContext";
// import QRCodeComponent from "../../components/QRCodeComponent";
import React from "react";
// import CryptoJS from "crypto-js";
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

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "diabetic":
      case "high":
      case "at risk":
        return "text-red-600 bg-red-100";
      case "healthy":
      case "low":
      case "not at risk":
        return "text-green-600 bg-green-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <User2 className="w-10 h-10 text-blue-500 mr-3" />
            Health Analysis Results
          </h1>
          <p className="text-gray-600 flex items-center justify-center">
            <Zap className="w-4 h-4 mr-2" />
            Your comprehensive health screening results and personalized
            recommendations
            <Sparkles className="w-4 h-4 ml-2" />
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-[290px_1fr_1fr] gap-3">
          {/* Left Column: Download Results */}
          <div className="space-y-6">
            {/* QR Code Download Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-200">
              <div className="flex items-center mb-4">
                <Download className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Download Results
                </h2>
              </div>

              <div className="text-center">
                {/* QR Code */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4 inline-block">
                  {downloadUrl && (
                    <QRCodeSVG
                      value={downloadUrl}
                      size={120}
                      level="M"
                      includeMargin={true}
                      className="mx-auto"
                    />
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Scan to download your complete health report
                </p>

                {/* Download Button */}
                {participantData?.participant_id && (
                  <button
                    onClick={async () => {
                      try {
                        const sessionId =
                          sessionStorage.getItem("current_session_id");
                        const response = await fetch(
                          `/api/download/${participantData.participant_id}?sessionId=${sessionId}`
                        );

                        if (response.ok) {
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `health_results_${participantData.participant_id}.pdf`;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } else {
                          alert("Failed to download PDF. Please try again.");
                        }
                      } catch (error) {
                        console.error("Download error:", error);
                        alert("Error downloading PDF. Please try again.");
                      }
                    }}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium inline-flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Results (JSON)</span>
                  </button>
                )}

                {/* Alternative JSON download for QR code users */}
                {!participantData?.participant_id && downloadUrl && (
                  <button
                    onClick={() => {
                      window.open(downloadUrl, "_blank");
                    }}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer"
                  >
                    Download Results (JSON)
                  </button>
                )}
              </div>
            </div>

            {/* Data Storage Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      result.saved ? "text-green-800" : "text-blue-800"
                    }`}
                  >
                    {result.saved ? "Data Saved Securely" : "Privacy Protected"}
                  </h4>
                  <p
                    className={`text-sm mt-1 ${
                      result.saved ? "text-green-700" : "text-blue-700"
                    }`}
                  >
                    {result.saved
                      ? "Your anonymized data is stored securely."
                      : "Your data was analyzed but not stored for privacy protection"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Results */}
          <div className="space-y-6">
            <div className="flex flex-col-2 gap-3 justify-between">
              {/* Blood Type Result */}
              <div className="bg-white w-full rounded-xl p-6 shadow-sm border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">
                        Predicted Blood Type
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {predictedBloodGroup || "B-"}
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-blue-600 font-medium">
                      Confidence:{" "}
                      {bloodGroupConfidence
                        ? (bloodGroupConfidence * 100).toFixed(1)
                        : "100.0"}
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Diabetes Risk Result */}
              <div
                className={`w-full bg-white rounded-xl p-6 shadow-sm border ${
                  isDiabetic ? "border-red-200" : "border-green-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isDiabetic ? "bg-red-100" : "bg-green-100"
                      }`}
                    >
                      <TrendingUp
                        className={`w-5 h-5 ${
                          isDiabetic ? "text-red-600" : "text-green-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isDiabetic ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        Diabetes Risk Assessment
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      isDiabetic ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {result.diabetes_risk?.toUpperCase() || "UNKNOWN"}
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isDiabetic ? "bg-red-600" : "bg-green-600"
                      }`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${
                        isDiabetic ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      Confidence:{" "}
                      {result.confidence
                        ? (result.confidence * 100).toFixed(1)
                        : "100.0"}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Participant Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Participant Information
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Age */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Age</span>
                  </div>
                  <div className="text-xl font-semibold text-gray-800">
                    {result.prediction_details?.age ||
                      result.participant_data?.age ||
                      "47"}{" "}
                    years
                  </div>
                </div>

                {/* Gender */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Gender</span>
                  </div>
                  <div className="text-xl font-semibold text-gray-800">
                    {result.prediction_details?.gender ||
                      result.participant_data?.gender ||
                      "Male"}
                  </div>
                </div>

                {/* Height */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Ruler className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Height</span>
                  </div>
                  <div className="text-xl font-semibold text-gray-800">
                    {result.prediction_details?.height ||
                      result.participant_data?.height ||
                      "162"}{" "}
                    cm
                  </div>
                </div>

                {/* Weight */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Weight className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Weight</span>
                  </div>
                  <div className="text-xl font-semibold text-gray-800">
                    {result.prediction_details?.weight ||
                      result.participant_data?.weight ||
                      "100"}{" "}
                    kg
                  </div>
                </div>

                {/* Blood Type */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Blood Type</span>
                  </div>
                  <div className="text-xl font-semibold text-gray-800">
                    {result.prediction_details?.blood_type ||
                      result.participant_data?.blood_type ||
                      "B"}
                  </div>
                </div>

                {/* Fingerprints */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Fingerprint className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Fingerprints</span>
                  </div>
                  <div className="text-xl font-semibold text-gray-800">
                    {result.prediction_details?.fingerprint_count ||
                      result.fingerprints?.length ||
                      "10"}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() =>
                  (window.location.href = "/fingerprint_analysis?consent=true")
                }
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium inline-flex items-center space-x-2 cursor-pointer"
              >
                <RefreshCw className="w-5 h-5" />
                <span>New Analysis</span>
              </button>

              <div>
                <EndButton />
              </div>
            </div>
          </div>

          {/* Right Column: Action Card */}
          <div className="space-y-6">
            {/* Preventive Health Advice Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-700">
                  Preventive Health Advice
                </h3>
              </div>
              <ul className="list-disc list-inside text-gray-700 text-md space-y-2">
                {preventiveHealthAdvice.map((item, idx) => (
                  <li key={idx}>{item.advice}</li>
                ))}
              </ul>
            </div>

            {/* Health Notice/Action Card */}
            {isDiabetic ? (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-700">
                    Important Health Notice
                  </h3>
                </div>

                <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                  Your analysis indicates elevated diabetes risk indicators. We
                  strongly recommend consulting with a healthcare professional
                  for proper medical evaluation and personalized advice.
                </p>

                <button
                  onClick={() => (window.location.href = "/hospitals")}
                  className="cursor-pointer w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold inline-flex items-center justify-center space-x-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Find Nearby Hospitals</span>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-700">
                    You're Healthy!
                  </h3>
                </div>

                {participantData?.willing_to_donate === true ? (
                  <div>
                    <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                      Great news! You're healthy and willing to donate blood.
                      Help save lives by donating blood to those in need.
                    </p>
                    <button
                      onClick={() =>
                        (window.location.href = "/blood-donation-centers")
                      }
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold inline-flex items-center justify-center space-x-2"
                    >
                      <Heart className="w-5 h-5" />
                      <span>Find Blood Donation Centers</span>
                    </button>
                  </div>
                ) : participantData?.willing_to_donate === false ? (
                  <div>
                    <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                      You are healthy! Consider blood donation to help save
                      lives.
                    </p>
                    <button
                      onClick={() =>
                        (window.location.href = "/blood-donation-centers")
                      }
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      View Blood Donation Centers
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    You are healthy! Please indicate if you're willing to donate
                    blood.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Debug participant data */}
        {/* {process.env.NODE_ENV === "development" && participantData && (
          <div className="text-xs text-gray-500 mb-4">
            Debug: willing_to_donate ={" "}
            {String(participantData.willing_to_donate)}
          </div>
        )} */}

        {/* Debug Information (for development) */}
        {/* {process.env.NODE_ENV === "development" && (
          <details className="mb-6">
            <summary className="cursor-pointer text-gray-500 text-sm">
              Debug Information
            </summary>
            <pre className="bg-gray-100 p-4 rounded text-xs mt-2 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        )} */}
      </div>
    </div>
  );
}
