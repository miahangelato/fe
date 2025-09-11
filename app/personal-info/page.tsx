"use client";
import { useState, useEffect } from "react";
import { useConsent } from "../../contexts/ConsentContext";
import { ParticipantData } from "../../types/participant";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User, Heart, Shield, ChevronDown, RotateCcw } from "lucide-react";

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
    <div className="min-h-screen p-6">
      {/* Background Video */}
      <video
        src="/personal-info/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 object-cover w-full h-full -z-1 opacity-10"
      />

      <div className="z-10">
        {/* Header */}
        <div className="z-10 text-center mb-6">
          <div className="z-10 inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-1">
            <Shield size={16} />
            Secure & Confidential
          </div>
          <h1 className="z-10 text-4xl font-bold text-gray-900 mb-4">
            Personal Information
          </h1>
          <p className="z-10 text-gray-600 text-lg mx-auto">
            Please provide your personal and health information below. All data
            is encrypted and handled with the highest security standards.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            {/* Participant Information Card */}
            <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-blue-50 border-b border-blue-100 p-4">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  Participant Information
                </CardTitle>
                <p className="text-gray-600 text-md ml-11">
                  Basic demographic and physical information
                </p>
              </CardHeader>

              <CardContent className="p-6 space-y-8">
                <div className="relative flex gap-3">
                  <label className="text-lg font-medium text-gray-700 mb-2">
                    Age:
                  </label>
                  <input
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    value={participant.age}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="relative flex">
                  <label className="text-lg font-medium text-gray-700 mb-2">
                    Weight (kg):
                  </label>
                  <input
                    name="weight"
                    type="number"
                    placeholder="Enter your weight in kg"
                    value={participant.weight}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="relative flex">
                  <label className="text-lg font-medium text-gray-700 mb-2">
                    Height (cm):
                  </label>
                  <input
                    name="height"
                    type="number"
                    placeholder="Enter your height in cm"
                    value={participant.height}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="relative flex flex-row justify-between">
                  <div className="relative flex gap-2">
                    <label className="text-lg font-medium text-gray-700 mb-2">
                      Gender:
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={participant.gender}
                        onChange={handleChange}
                        className="w-62 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-colors cursor-pointer"
                      >
                        <option value="" disabled>
                          Select your gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="relative flex gap-2">
                    <label className="text-lg font-medium text-gray-700 mb-2">
                      Blood Type:
                    </label>
                    <div className="relative">
                      <select
                        name="blood_type"
                        value={participant.blood_type}
                        onChange={handleChange}
                        className="w-62 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-colors cursor-pointer"
                      >
                        <option value="" disabled>
                          Select your blood type
                        </option>
                        <option value="O">O</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="unknown">Unknown</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donation Information Card */}
            <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-blue-50 border-b border-blue-100 p-4">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  Donation Information
                </CardTitle>
                <p className="text-gray-600 ml-12 text-md">
                  Your willingness to participate in donation programs
                </p>
              </CardHeader>

              <CardContent className="p-6 space-y-2">
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Willing to Donate?
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="willing_to_donate"
                        value="yes"
                        checked={willingToDonate === true}
                        onChange={handleWillingToDonateChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        Yes, I am willing to donate
                      </span>
                    </label>
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="willing_to_donate"
                        value="no"
                        checked={willingToDonate === false}
                        onChange={handleWillingToDonateChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        No, I am not willing to donate
                      </span>
                    </label>
                  </div>
                </div>

                {willingToDonate && (
                  <div className="space-y-2 border-t border-gray-100">
                    <div className="relative flex justify-between gap-3">
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                          Sleep Hours
                        </label>
                        <input
                          name="sleep_hours"
                          type="number"
                          placeholder="Hours of sleep last night"
                          value={participant.sleep_hours}
                          onChange={handleChange}
                          className="w-100 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                          Last Donation Date:
                        </label>
                        <input
                          name="last_donation_date"
                          type="date"
                          value={participant.last_donation_date}
                          onChange={handleChange}
                          className="w-70 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mt-4">
                        Health & Lifestyle
                      </label>

                      <div className="grid grid-cols-3">
                        <label className="flex items-start space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            name="had_alcohol_last_24h"
                            checked={participant.had_alcohol_last_24h}
                            onChange={handleChange}
                            className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-lg text-gray-700">
                            Had alcohol in the last 24 hours
                          </span>
                        </label>

                        <label className="flex items-start space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            name="ate_before_donation"
                            checked={participant.ate_before_donation}
                            onChange={handleChange}
                            className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-lg text-gray-700">
                            Ate before donation
                          </span>
                        </label>

                        <label className="flex items-start space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            name="ate_fatty_food"
                            checked={participant.ate_fatty_food}
                            onChange={handleChange}
                            className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-lg text-gray-700">
                            Ate fatty food
                          </span>
                        </label>

                        <label className="flex items-start space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            name="recent_tattoo_or_piercing"
                            checked={participant.recent_tattoo_or_piercing}
                            onChange={handleChange}
                            className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-lg text-gray-700">
                            Recent tattoo or piercing
                          </span>
                        </label>

                        <label className="flex items-start space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            name="has_chronic_condition"
                            checked={participant.has_chronic_condition}
                            onChange={handleChange}
                            className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-lg text-gray-700">
                            Has chronic condition
                          </span>
                        </label>

                        {participant.has_chronic_condition && (
                          <label className="flex space-x-3 p-2 rounded-lg bg-gray-300 hover:bg-gray-80 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              name="condition_controlled"
                              checked={participant.condition_controlled}
                              onChange={handleChange}
                              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-lg text-gray-900">
                              Condition is controlled
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-between items-center gap-2 mt-8">
            {/* Left side: Back */}
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="px-6 py-3 text-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              Back
            </Button>

            {/* Right side: Clear Form + Continue */}
            <div className="flex flex-row gap-2 w-auto items-center">
              <Button
                type="button"
                onClick={handleClearForm}
                variant="outline"
                className="px-6 py-3 text-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="relative" />
                Clear Form
              </Button>

              <button
                type="submit"
                disabled={submitting}
                className={`flex-none px-6 py-3 text-xl rounded-lg font-medium transition-all duration-200 ${
                  submitting
                    ? "bg-blue-300 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl cursor-pointer"
                }`}
              >
                {submitting
                  ? "Processing..."
                  : "Continue to Fingerprint Scan →"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
