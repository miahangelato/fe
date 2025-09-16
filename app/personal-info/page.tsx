"use client";
import { useState, useEffect } from "react";
import { useConsent } from "../../contexts/ConsentContext";
import { ParticipantData } from "../../types/participant";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Heart,
  Shield,
  ChevronDown,
  RotateCcw,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PersonalInfoPage() {
  const { storeFormData, retrieveFormData, clearFormData } = useConsent();
  const router = useRouter();

  const [participant, setParticipant] = useState<ParticipantData>({
    age: "",
    weight: "",
    height: "",
    gender: "male",
    blood_type: "O",
    sleep_hours: "",
    had_alcohol_last_24h: false,
    ate_before_donation: false,
    ate_fatty_food: false,
    recent_tattoo_or_piercing: false,
    has_chronic_condition: false,
    condition_controlled: true,
    last_donation_date: "",
  });

  const [willingToDonate, setWillingToDonate] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load form data on component mount
  useEffect(() => {
    const savedFormData = retrieveFormData();
    if (savedFormData) {
      if (savedFormData.participant) {
        setParticipant(savedFormData.participant);
      }
      if (savedFormData.willingToDonate !== undefined) {
        setWillingToDonate(savedFormData.willingToDonate);
      }
      console.log("Form data loaded from storage");
    }
  }, [retrieveFormData]);

  // Save form data whenever it changes
  useEffect(() => {
    const formData = {
      participant,
      willingToDonate,
      timestamp: Date.now(),
    };
    storeFormData(formData);
  }, [participant, willingToDonate, storeFormData]);

  const isFormValid = (): boolean => {
    // Basic required fields
    const basicFieldsValid =
      String(participant.age).trim() !== "" &&
      String(participant.weight).trim() !== "" &&
      String(participant.height).trim() !== "" &&
      willingToDonate !== null;

    if (willingToDonate === true) {
      const donationFieldsValid =
        String(participant.sleep_hours ?? "").trim() !== "";
      return basicFieldsValid && donationFieldsValid;
    }

    return basicFieldsValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setParticipant((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleWillingToDonateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWillingToDonate(e.target.value === "yes");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    // Use the validation function instead of manual checks
    if (!isFormValid()) {
      alert("Please fill out all required fields.");
      return;
    }

    // Basic validation
    if (!participant.age || !participant.weight || !participant.height) {
      alert("Please fill out age, weight, and height.");
      return;
    }

    if (willingToDonate === null) {
      alert("Please indicate if you are willing to donate blood.");
      return;
    }

    try {
      setSubmitting(true);

      // Store the completed form data
      const formData = {
        participant,
        willingToDonate,
        timestamp: Date.now(),
        completed: true, // Mark as completed
      };
      storeFormData(formData);

      // Navigate to fingerprint scanning page
      router.push("/fingerprint_analysis");
    } catch (error) {
      console.error("Navigation error:", error);
      alert("Error proceeding to next step. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setParticipant({
      age: "",
      weight: "",
      height: "",
      gender: "male",
      blood_type: "O",
      sleep_hours: "",
      had_alcohol_last_24h: false,
      ate_before_donation: false,
      ate_fatty_food: false,
      recent_tattoo_or_piercing: false,
      has_chronic_condition: false,
      condition_controlled: true,
      last_donation_date: "",
    });
    setWillingToDonate(null);
    clearFormData();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          "linear-gradient(120deg, #fff 40%, #78caff 100%), linear-gradient(to bottom, transparent 60%, #78caff 100%)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="relative z-10 p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-7xl font-bold text-slate-800 mb-2">
            Personal Information
          </h1>
          <p className="text-3xl text-slate-600">
            We prioritize your privacy and data security.
          </p>
        </div>

        <div onSubmit={handleSubmit}>
          <div className="flex gap-2">
            {/* Left Column - Main Form */}
            <div className="flex-1 space-y-4">
              {/* Participant Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border-3 border-[#75a9d7]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-4xl font-semibold text-slate-800">
                    Participant Information
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="space-y-2">
                    <label className="text-3xl font-medium text-slate-700">
                      Age
                    </label>
                    <input
                      name="age"
                      type="number"
                      placeholder=""
                      value={participant.age}
                      onChange={handleChange}
                      required
                      className="w-full px-4 mt-4 py-3 border-3 border-[#75a9d7] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-3xl font-medium text-slate-700">
                      Height (cm)
                    </label>
                    <input
                      name="height"
                      type="number"
                      placeholder=""
                      value={participant.height}
                      onChange={handleChange}
                      required
                      className="w-full px-4 mt-4 py-3 border-3 border-[#75a9d7] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-3xl font-medium text-slate-700">
                      Weight (kg)
                    </label>
                    <input
                      name="weight"
                      type="number"
                      placeholder=""
                      value={participant.weight}
                      onChange={handleChange}
                      required
                      className="w-full px-4 mt-4 py-3 border-3 border-[#75a9d7] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-3xl font-medium text-slate-700">
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={participant.gender}
                        onChange={handleChange}
                        className="w-full px-4 mt-4 py-3 border-3 border-[#75a9d7] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xl cursor-pointer"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-3xl font-medium text-slate-700">
                      Blood Type
                    </label>
                    <div className="relative">
                      <select
                        name="blood_type"
                        value={participant.blood_type}
                        onChange={handleChange}
                        className="w-full px-4 mt-4 py-3 border-3 border-[#75a9d7] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xl cursor-pointer"
                      >
                        <option value="O">O</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="unknown">Unknown</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Donation Information */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-4xl font-semibold text-slate-800">
                    Donation Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-5 h-5 text-blue-600" />
                    <span className="text-3xl font-medium text-slate-700">
                      Are you willing to donate blood?
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <label
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors min-w-24 ${
                        willingToDonate === true
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="willing_to_donate"
                        value="yes"
                        checked={willingToDonate === true}
                        onChange={handleWillingToDonateChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-bold text-2xl">Yes</span>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors min-w-24 ${
                        willingToDonate === false
                          ? "bg-red-600 text-white border-red-600"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="willing_to_donate"
                        value="no"
                        checked={willingToDonate === false}
                        onChange={handleWillingToDonateChange}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="font-bold text-2xl">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Dynamic Content */}
            {willingToDonate !== null && (
              <div className="w-150">
                {willingToDonate === false ? (
                  // Show Blood Donation Requirements when user says "No"
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg sticky top-8">
                    <h3 className="text-4xl font-bold mb-4">
                      Blood Donation Requirements
                    </h3>

                    <div className="space-y-3 mb-6">
                      {[
                        "Be at least 17-65 years old",
                        "Weigh at least 50kg",
                        "Be in good general health",
                        "Not have donated in last 8 weeks",
                        "No tattoos/piercings last 6 months",
                        "Not pregnant/breastfeeding",
                        "No recent fever/infection",
                        "No high-risk behaviors",
                      ].map((requirement, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="w-4 h-4 mt-0.5 text-green-300 flex-shrink-0" />
                          <span className="text-3xl text-blue-50">
                            {requirement}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Alert className="bg-red-700 border-2 border-red-600 text-white backdrop-blur-md flex items-start p-4 rounded-xl shadow-lg pointer-events-auto">
                      <i className="bi bi-exclamation-triangle-fill text-3xl text-white mr-3" />
                      <AlertDescription className="text-white text-2xl leading-relaxed relative flex">
                        <span className="font-bold text-white mr-2">
                          Important:
                        </span>
                        Not a substitute for professional medical advice.
                        Consult a doctor.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  // Show Donation Information Form when user says "Yes"
                  <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8 border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Heart className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-4xl font-semibold text-slate-800">
                        Donation Details
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-2xl font-medium text-slate-700">
                            Sleep Hours
                          </label>
                          <input
                            name="sleep_hours"
                            type="number"
                            placeholder="Hours of sleep last night"
                            value={participant.sleep_hours}
                            onChange={handleChange}
                            className="w-full px-4 mt-4 py-3 border-3 border-[#75a9d7] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xl"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-2xl font-medium text-slate-700">
                            Last Donation Date
                          </label>
                          <input
                            name="last_donation_date"
                            type="date"
                            value={participant.last_donation_date}
                            onChange={handleChange}
                            className="w-full px-4 mt-4 py-3 border-3 border-[#75a9d7] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xl cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-medium text-slate-700">
                          Health & Lifestyle
                        </h4>
                        <div className="space-y-1">
                          {[
                            {
                              key: "had_alcohol_last_24h",
                              label: "Had alcohol in the last 24 hours",
                            },
                            {
                              key: "ate_before_donation",
                              label: "Ate before donation",
                            },
                            { key: "ate_fatty_food", label: "Ate fatty food" },
                            {
                              key: "recent_tattoo_or_piercing",
                              label: "Recent tattoo or piercing",
                            },
                            {
                              key: "has_chronic_condition",
                              label: "Has chronic condition",
                            },
                          ].map(({ key, label }) => (
                            <label
                              key={key}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                name={key}
                                checked={
                                  participant[
                                    key as keyof ParticipantData
                                  ] as boolean
                                }
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-2xl text-slate-700">
                                {label}
                              </span>
                            </label>
                          ))}

                          {participant.has_chronic_condition && (
                            <label className="flex items-center gap-3 ml-6 rounded-lg cursor-pointer">
                              <input
                                type="checkbox"
                                name="condition_controlled"
                                checked={participant.condition_controlled}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-2xl text-slate-700">
                                Condition is controlled
                              </span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-between items-center mt-8">
            <Button
              type="button"
              onClick={handleBack}
              className="text-4xl bg-white text-[#3a87d5] border border-[#3a87d5] hover:bg-[#e0f2ff] px-10 py-8 rounded-lg font-semibold"
            >
              ← Back
            </Button>
            <div className="flex-1" />
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={handleClearForm}
                className="text-4xl bg-white text-[#dc2626] border border-[#dc2626] hover:bg-[#fef2f2] px-10 py-8 rounded-lg font-semibold"
              >
                Clear Fields
              </Button>
              <Button
                type="submit"
                disabled={submitting || !isFormValid()}
                onClick={handleSubmit}
                className={`px-10 py-8 text-4xl flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ${
                  submitting || !isFormValid()
                    ? "bg-[#6b7280] cursor-not-allowed text-white opacity-50"
                    : "bg-[#1a3557] text-white hover:bg-[#3a87d5] cursor-pointer"
                }`}
              >
                <span>
                  {submitting
                    ? "Processing..."
                    : "Continue to Fingerprint Scan"}
                </span>
                {!submitting && <span className="text-3xl">→</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
