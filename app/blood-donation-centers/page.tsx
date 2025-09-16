"use client";
import React, { useState } from "react";
import EndButton from "../../components/Endbutton";
import { useRouter } from "next/navigation";
import { MapPin, Phone, Globe, Mail, Hospital, RefreshCw } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Data
import { bloodDonationCenters } from "@/data/blood-group/bloodDonationCenters";

const BloodDonationCentersPage: React.FC = () => {
  const router = useRouter();
  const [cityFilter, setCityFilter] = useState<string>("all");

  const handleBack = () => {
    router.push("/fingerprint_analysis?consent=true");
  };

  const getFilteredData = () => {
    let filteredCenters = bloodDonationCenters;

    if (cityFilter !== "all") {
      filteredCenters = bloodDonationCenters.filter(
        (city) => city.city === cityFilter
      );
    }

    return { centers: filteredCenters };
  };

  const filteredData = getFilteredData();

  return (
    <div
      className="min-h-screen p-8 flex overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, #fff 40%, #fca5a5 100%), linear-gradient(to bottom, transparent 60%, #fecaca 100%)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Sidebar */}
      <aside className="w-96 flex-shrink-0 overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-rose-900 mb-4">
            Blood Donation Centers
          </h1>
          <p className="text-slate-700 text-2xl mx-auto mb-6">
            Thank you for considering blood donation! Find verified centers in
            your area and help save lives.
          </p>
        </div>

        {/* City Filter */}
        <div className="flex flex-col gap-6">
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="cursor-pointer flex items-center gap-2 text-2xl border-2 border-slate-200 rounded-xl px-4 py-3">
              <MapPin className="h-6 w-6 text-red-600" />
              <span className="font-semibold text-slate-700">City:</span>
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>

            <SelectContent className="text-2xl">
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="Angeles">Angeles</SelectItem>
              <SelectItem value="Mabalacat">Mabalacat</SelectItem>
              <SelectItem value="San Fernando">San Fernando</SelectItem>
            </SelectContent>
          </Select>

          {/* Buttons */}
          <div className="flex flex-col gap-4 mt-6">
            <button
              onClick={() => router.push("/hospitals")}
              className="cursor-pointer bg-white/80 border-2 border-blue-300 text-blue-800 text-2xl px-4 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
            >
              <Hospital className="w-6 h-6" /> Hospitals
            </button>
            <button
              onClick={handleBack}
              className="cursor-pointer bg-white text-slate-900 border-2 border-slate-900 text-2xl px-4 py-3 rounded-xl hover:bg-black hover:text-white transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-6 h-6" /> Back to Analysis
            </button>
            <EndButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-6 overflow-x-auto">
        <div className="grid grid-rows-2 grid-flow-col gap-4 mb-5">
          {filteredData.centers
            .flatMap((city) => city.centers)
            .map((center, i) => (
              <div
                key={`center-${i}`}
                className="min-w-[35rem] bg-white/90 border border-rose-900 rounded-2xl p-6 shadow-xl"
              >
                <h3 className="text-4xl font-bold text-slate-800 mb-2">
                  {center.name}
                </h3>
                <p className="text-slate-600 mb-4 text-2xl">{center.address}</p>

                {center.notes && (
                  <p className="mb-4 font-semibold text-xl">
                    Note: <span className="font-normal">{center.notes}</span>
                  </p>
                )}

                <div className="space-y-2 text-2xl">
                  {center.tel && (
                    <div className="flex items-center gap-2">
                      <Phone className="text-blue-500" />
                      {Array.isArray(center.tel)
                        ? center.tel.join(", ")
                        : center.tel}
                    </div>
                  )}
                  {center.mobile && (
                    <div className="flex items-center gap-2">
                      <Phone className="text-green-500" />
                      {Array.isArray(center.mobile)
                        ? center.mobile.join(", ")
                        : center.mobile}
                    </div>
                  )}
                  {center.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="text-red-900" />
                      {Array.isArray(center.email)
                        ? center.email.join(", ")
                        : center.email}
                    </div>
                  )}
                  {center.facebook && (
                    <div className="flex items-center gap-2 break-all">
                      <i className="bi bi-facebook text-blue-600" />
                      {center.facebook}
                    </div>
                  )}
                  {center.website && (
                    <div className="flex items-center gap-2 break-all">
                      <Globe className="text-indigo-500" />
                      {center.website}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default BloodDonationCentersPage;
