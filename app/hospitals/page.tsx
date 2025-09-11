"use client";
import React, { useState } from "react";
import EndButton from "../../components/Endbutton";
import { useRouter } from "next/navigation";
import { MapPin, Phone, Facebook, Globe, Filter } from "lucide-react";

// Datas
import { diabetesCenters } from "@/data/diabetes/diabetesCenters";
import { diabetesDoctors } from "@/data/diabetes/diabetesDoctors";
import { diabetesLabs } from "@/data/diabetes/diabetesLab";

const HospitalsPage: React.FC = () => {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  const handleBack = () => {
    router.push("/fingerprint_analysis?consent=true");
  };

  // Filter data based on selected filters
  const getFilteredData = () => {
    let filteredCenters = diabetesCenters;
    let filteredDoctors = diabetesDoctors;
    let filteredLabs = diabetesLabs;

    // Filter by city
    if (cityFilter !== "all") {
      filteredCenters = diabetesCenters.filter(
        (city) => city.city === cityFilter
      );
      filteredDoctors = diabetesDoctors.filter(
        (city) => city.city === cityFilter
      );
      filteredLabs = diabetesLabs.filter((city) => city.city === cityFilter);
    }

    return {
      centers: filteredCenters,
      doctors: filteredDoctors,
      labs: filteredLabs,
    };
  };

  const filteredData = getFilteredData();

  // Determine which sections to show based on type filter
  const shouldShowCenters = typeFilter === "all" || typeFilter === "centers";
  const shouldShowDoctors = typeFilter === "all" || typeFilter === "doctors";
  const shouldShowLabs = typeFilter === "all" || typeFilter === "labs";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 flex items-center justify-center overflow-hidden">
      {/* BG Design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header Part */}
      <div className="relative w-full mt-4">
        <div className="text-center mb-6">
          {/* Words */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 mr-4">
              <div className="relative">
                <div className="w-8 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-8 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
            <h1 className="text-7xl font-black bg-gradient-to-r from-green-800 via-blue-700 to-indigo-800 bg-clip-text text-transparent tracking-tight">
              Nearby Hospitals
            </h1>
          </div>
          <p className="text-slate-600 text-xl font-medium mx-auto leading-relaxed mb-3">
            Find immediate medical care at these verified healthcare facilities
            in your area
          </p>

          {/* Buttons */}
          <div className="flex flex-row gap-6 justify-center">
            <button
              onClick={handleBack}
              className="cursor-pointer bg-white/80 backdrop-blur-xl border-2 border-slate-200 text-slate-700 hover:bg-white hover:border-blue-300 hover:text-blue-700 transition-all duration-300 text-lg px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-slate-200/50"
            >
              Back to Analysis
            </button>
            <div className="flex justify-center">
              <EndButton />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex justify-center mb-8 gap-6">
          {/* Type Filter */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl border-2 border-green-200 rounded-2xl px-6 py-3 shadow-lg">
              <Filter className="h-5 w-5 text-green-600" />
              <label className="text-slate-700 font-semibold">
                Filter by Type:
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-black/5 p-1 rounded-lg text-slate-800 font-medium outline-none cursor-pointer"
              >
                <option value="all">All Services</option>
                <option value="centers">Diabetes Centers</option>
                <option value="doctors">Diabetes Doctors</option>
                <option value="labs">Diabetes Laboratories</option>
              </select>
            </div>
          </div>

          {/* City Filter */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl border-2 border-blue-200 rounded-2xl px-6 py-3 shadow-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
              <label className="text-slate-700 font-semibold">
                Filter by City:
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-black/5 p-1 rounded-lg text-slate-800 font-medium outline-none cursor-pointer"
              >
                <option value="all">All Cities</option>
                <option value="Angeles">Angeles</option>
                <option value="Mabalacat">Mabalacat</option>
                <option value="San Fernando">San Fernando</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full h-1 bg-blue-200 rounded-full mx-auto mb-6"></div>

        {/* Centers Section */}
        {shouldShowCenters && (
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-blue-800 mb-5 flex items-center justify-center gap-4">
              Diabetes Centers
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {filteredData.centers
                .flatMap((city) => city.centers)
                .map((center, i) => (
                  <div
                    key={`center-${i}`}
                    className="group relative bg-white/80 backdrop-blur-xl border border-2 border-green-900 rounded-3xl p-6 hover:bg-white/90 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.01] overflow-hidden"
                  >
                    {/* Card bg */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                    {/* Name + Address */}
                    <div className="relative">
                      <div className="flex items-center mb-2">
                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-green-700 transition-colors">
                          {center.name}
                        </h3>
                      </div>
                      <div className="flex items-center text-slate-600 mb-4 ml-3">
                        <span className="text-lg font-medium">
                          {center.address}
                        </span>
                      </div>

                      {/* Contacts */}
                      <div className="grid grid-cols-2 gap-4">
                        {center.tel && (
                          <div className="text-center bg-slate-50/80 rounded-2xl">
                            <Phone className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                            <div className="text-md font-bold text-slate-700 break-words">
                              {Array.isArray(center.tel)
                                ? center.tel.join(", ")
                                : center.tel}
                            </div>
                            <div className="text-md text-slate-500 font-medium">
                              Telephone
                            </div>
                          </div>
                        )}
                        {center.mobile && (
                          <div className="text-center bg-slate-50/80 rounded-2xl">
                            <Phone className="h-5 w-5 text-green-500 mx-auto mb-1" />
                            <div className="text-md font-bold text-slate-700 break-words">
                              {Array.isArray(center.mobile)
                                ? center.mobile.join(", ")
                                : center.mobile}
                            </div>
                            <div className="text-md text-slate-500 font-medium">
                              Mobile
                            </div>
                          </div>
                        )}
                        {center.facebook && (
                          <div className="text-center bg-slate-50/80 rounded-2xl col-span-2">
                            <Facebook className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                            <div className="text-md font-bold text-slate-700 break-words">
                              {center.facebook}
                            </div>
                            <div className="text-md text-slate-500 font-medium">
                              Facebook
                            </div>
                          </div>
                        )}
                        {center.website && (
                          <div className="text-center bg-slate-50/80 rounded-2xl col-span-2">
                            <Globe className="h-5 w-5 text-indigo-500 mx-auto mb-1" />
                            <div className="text-md font-bold text-slate-700 break-all">
                              {center.website}
                            </div>
                            <div className="text-md text-slate-500 font-medium">
                              Website
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {shouldShowCenters && (shouldShowDoctors || shouldShowLabs) && (
          <div className="w-full h-1 bg-blue-200 rounded-full mx-auto mb-10"></div>
        )}

        {/* Doctors Section */}
        {shouldShowDoctors && (
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-blue-800 mb-5 flex items-center justify-center gap-4">
              Diabetes Doctors
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {filteredData.doctors
                .flatMap((city) => city.doctors)
                .map((doctor, i) => (
                  <div
                    key={`doctor-${i}`}
                    className="group relative bg-white/80 backdrop-blur-xl border border-2 border-green-900 rounded-3xl p-6 hover:bg-white/90 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.01] overflow-hidden"
                  >
                    {/* Card bg */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                    {/* Name + Address */}
                    <div className="relative">
                      <div className="flex items-center mb-2">
                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-green-700 transition-colors">
                          {doctor.name}
                        </h3>
                      </div>
                      <div className="flex items-center text-slate-600 mb-4 ml-3">
                        <span className="text-lg font-medium">
                          {doctor.address}
                        </span>
                      </div>

                      {/* Contacts */}
                      <div className="grid grid-cols-2 gap-4">
                        {doctor.tel && (
                          <div className="text-center bg-slate-50/80 rounded-2xl">
                            <Phone className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                            <div className="text-md font-bold text-slate-700 break-words">
                              {Array.isArray(doctor.tel)
                                ? doctor.tel.join(", ")
                                : doctor.tel}
                            </div>
                            <div className="text-md text-slate-500 font-medium">
                              Telephone
                            </div>
                          </div>
                        )}
                        {doctor.mobile && (
                          <div className="text-center bg-slate-50/80 rounded-2xl">
                            <Phone className="h-5 w-5 text-green-500 mx-auto mb-1" />
                            <div className="text-md font-bold text-slate-700 break-words">
                              {Array.isArray(doctor.mobile)
                                ? doctor.mobile.join(", ")
                                : doctor.mobile}
                            </div>
                            <div className="text-md text-slate-500 font-medium">
                              Mobile
                            </div>
                          </div>
                        )}
                        {doctor.facebook && (
                          <div className="text-center bg-slate-50/80 rounded-2xl col-span-2">
                            <Facebook className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                            <div className="text-md font-bold text-slate-700 break-words">
                              {doctor.facebook}
                            </div>
                            <div className="text-md text-slate-500 font-medium">
                              Facebook
                            </div>
                          </div>
                        )}
                        {doctor.website && (
                          <div className="text-center bg-slate-50/80 rounded-2xl col-span-2">
                            <Globe className="h-5 w-5 text-indigo-500 mx-auto mb-1" />
                            <div className="text-md font-bold text-slate-700 break-all">
                              {doctor.website}
                            </div>
                            <div className="text-md text-slate-500 font-medium">
                              Website
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {shouldShowDoctors && shouldShowLabs && (
          <div className="w-full h-1 bg-blue-200 rounded-full mx-auto mb-10"></div>
        )}

        {/* Laboratory Section */}
        {shouldShowLabs && (
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-blue-800 mb-5 flex items-center justify-center gap-4">
              Diabetes Laboratories
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {filteredData.labs
                .flatMap((city) => city.labs)
                .map((lab, i) => (
                  <div
                    key={`lab-${i}`}
                    className="group relative bg-white/80 backdrop-blur-xl border border-2 border-green-900 rounded-3xl p-6 hover:bg-white/90 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.01] overflow-hidden"
                  >
                    {/* Card bg */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                    {/* Name + Address */}
                    <div className="relative">
                      <div className="flex items-center mb-2">
                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-green-700 transition-colors">
                          {lab.name}
                        </h3>
                      </div>
                      <div className="flex items-center text-slate-600 mb-4 ml-3">
                        <span className="text-lg font-medium">
                          {lab.address}
                        </span>
                      </div>

                      {/* Contacts */}
                      <div className="grid grid-cols-2 gap-4">
                        {lab.tel && (
                          <div className="text-center bg-slate-50/80 rounded-2xl">
                            <Phone className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                            <div className="text-md font-bold text-slate-700 break-words">
                              {Array.isArray(lab.tel)
                                ? lab.tel.join(", ")
                                : lab.tel}
                            </div>
                            <div className="text-md text-slate-500 font-medium">
                              Telephone
                            </div>
                          </div>
                        )}
                        {lab.mobile && (
                          <div className="text-center bg-slate-50/80 rounded-2xl">
                            <Phone className="h-5 w-5 text-green-500 mx-auto mb-1" />
                            <div className="text-md font-bold text-slate-700 break-words">
                              {Array.isArray(lab.mobile)
                                ? lab.mobile.join(", ")
                                : lab.mobile}
                            </div>
                            <div className="text-md text-slate-500 font-medium">
                              Mobile
                            </div>
                          </div>
                        )}
                        {lab.facebook && (
                          <div className="text-center bg-slate-50/80 rounded-2xl col-span-2">
                            <Facebook className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                            <div className="text-md font-bold text-slate-700 break-words">
                              {lab.facebook}
                            </div>
                            <div className="text-md text-slate-500 font-medium">
                              Facebook
                            </div>
                          </div>
                        )}
                        {lab.website && (
                          <div className="text-center bg-slate-50/80 rounded-2xl col-span-2">
                            <Globe className="h-5 w-5 text-indigo-500 mx-auto mb-1" />
                            <div className="text-md font-bold text-slate-700 break-all">
                              {lab.website}
                            </div>
                            <div className="text-md text-slate-500 font-medium">
                              Website
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalsPage;
