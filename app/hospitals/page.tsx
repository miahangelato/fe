"use client";
import React, { useState } from "react";
import EndButton from "../../components/Endbutton";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  Globe,
  Filter,
  RefreshCw,
  Mail,
  Heart,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useConsent } from "../../contexts/ConsentContext";

// Datas
import { diabetesCenters } from "@/data/diabetes/diabetesCenters";
import { diabetesDoctors } from "@/data/diabetes/diabetesDoctors";
import { diabetesLabs } from "@/data/diabetes/diabetesLab";

const HospitalsPage: React.FC = () => {
  const router = useRouter();
  const { participantData } = useConsent();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  const handleBack = () => {
    router.push("/fingerprint_analysis?consent=true");
  };

  const getFilteredData = () => {
    let filteredCenters = diabetesCenters;
    let filteredDoctors = diabetesDoctors;
    let filteredLabs = diabetesLabs;

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
  const shouldShowCenters = typeFilter === "all" || typeFilter === "centers";
  const shouldShowDoctors = typeFilter === "all" || typeFilter === "doctors";
  const shouldShowLabs = typeFilter === "all" || typeFilter === "labs";

  return (
    <div
      className="min-h-screen p-8 flex overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, #fff 40%, #78caff 100%), linear-gradient(to bottom, transparent 60%, #78caff 100%)",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Sidebar */}
      <aside className="w-96 flex-shrink-0 overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-slate-800 mb-4">
            Nearby Healthcare Services
          </h1>

          {/* Description */}
          <p className="text-slate-600 text-3xl mx-auto mb-6">
            Find verified healthcare facilities in your area.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-6">
          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="cursor-pointer flex items-center gap-2 text-2xl border-2 border-slate-200 rounded-xl px-4 py-3">
              <Filter className="h-6 w-6 text-slate-600" />
              <span className="font-semibold text-slate-700">Type:</span>
              <SelectValue placeholder="All Services" />
            </SelectTrigger>

            <SelectContent className="text-2xl">
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="centers">Centers</SelectItem>
              <SelectItem value="doctors">Doctors</SelectItem>
              <SelectItem value="labs">Laboratories</SelectItem>
            </SelectContent>
          </Select>

          {/* City Filter */}
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="cursor-pointer flex items-center gap-2 text-2xl border-2 border-slate-200 rounded-xl px-4 py-3">
              <MapPin className="h-6 w-6 text-slate-600" />
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
            {participantData?.willing_to_donate && (
              <button
                onClick={() =>
                  (window.location.href = "/blood-donation-centers")
                }
                className="cursor-pointer bg-red-600 text-white text-2xl px-4 py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Heart className="w-5 h-5" /> Donate Blood
              </button>
            )}
            <button
              onClick={handleBack}
              className="cursor-pointer bg-white text-slate-900 border-2 border-slate-900 text-2xl px-4 py-3 rounded-xl hover:bg-black hover:text-white transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> New Analysis
            </button>
            <EndButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-6 overflow-x-auto space-y-4">
        {(() => {
          const showCenters =
            shouldShowCenters &&
            filteredData.centers.flatMap((c) => c.centers).length > 0;
          const showDoctors =
            shouldShowDoctors &&
            filteredData.doctors.flatMap((c) => c.doctors).length > 0;
          const showLabs =
            shouldShowLabs &&
            filteredData.labs.flatMap((c) => c.labs).length > 0;

          const visibleCount = [showCenters, showDoctors, showLabs].filter(
            Boolean
          ).length;

          // ✅ Case: Only one type visible → 3 rows grid, horizontal scroll
          if (visibleCount === 1) {
            const items = [
              ...(showCenters
                ? filteredData.centers.flatMap((c) => c.centers)
                : []),
              ...(showDoctors
                ? filteredData.doctors.flatMap((c) => c.doctors)
                : []),
              ...(showLabs ? filteredData.labs.flatMap((c) => c.labs) : []),
            ];

            return (
              <div className="overflow-x-auto">
                <div className="grid grid-rows-2 grid-flow-col gap-4 mb-5">
                  {items.map((item, i) => (
                    <div
                      key={`item-${i}`}
                      className="min-w-[35rem] bg-white/90 border border-slate-900 rounded-2xl p-6 shadow-xl"
                    >
                      <h3 className="text-4xl font-bold text-slate-800 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-slate-600 mb-4 text-2xl">
                        {item.address}
                      </p>
                      {item.notes && (
                        <p className="mb-4 font-semibold text-xl">
                          Note:{" "}
                          <span className="font-normal">{item.notes}</span>
                        </p>
                      )}
                      <div className="space-y-2 text-2xl">
                        {item.tel && (
                          <div className="flex items-center gap-2">
                            <Phone className="text-blue-500" />{" "}
                            {Array.isArray(item.tel)
                              ? item.tel.join(", ")
                              : item.tel}
                          </div>
                        )}
                        {item.mobile && (
                          <div className="flex items-center gap-2">
                            <Phone className="text-green-500" />{" "}
                            {Array.isArray(item.mobile)
                              ? item.mobile.join(", ")
                              : item.mobile}
                          </div>
                        )}
                        {item.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="text-red-900" />{" "}
                            {Array.isArray(item.email)
                              ? item.email.join(", ")
                              : item.email}
                          </div>
                        )}
                        {item.facebook && (
                          <div className="flex items-center gap-2 break-all">
                            <i className="bi bi-facebook text-blue-600" />
                            {item.facebook}
                          </div>
                        )}
                        {item.website && (
                          <div className="flex items-center gap-2 break-all">
                            <Globe className="text-indigo-500" /> {item.website}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // ✅ Case: Multiple types visible → keep your original row-by-row layout
          return (
            <>
              {/* Centers */}
              {showCenters && (
                <div className="flex gap-2">
                  {filteredData.centers
                    .flatMap((c) => c.centers)
                    .map((center, i) => (
                      <div
                        key={`center-${i}`}
                        className="min-w-[35rem] bg-white/90 border border-slate-900 rounded-2xl p-6 shadow-xl"
                      >
                        <h3 className="text-4xl font-bold text-slate-800 mb-2">
                          {center.name}
                        </h3>
                        <p className="text-slate-600 mb-4 text-2xl">
                          {center.address}
                        </p>
                        <div className="space-y-2 text-2xl">
                          {center.tel && (
                            <div className="flex items-center gap-2">
                              <Phone className="text-blue-500" />{" "}
                              {Array.isArray(center.tel)
                                ? center.tel.join(", ")
                                : center.tel}
                            </div>
                          )}
                          {center.mobile && (
                            <div className="flex items-center gap-2">
                              <Phone className="text-green-500" />{" "}
                              {Array.isArray(center.mobile)
                                ? center.mobile.join(", ")
                                : center.mobile}
                            </div>
                          )}
                          {center.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="text-red-900" />{" "}
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
                              <Globe className="text-indigo-500" />{" "}
                              {center.website}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Doctors */}
              {showDoctors && (
                <div className="flex gap-2">
                  {filteredData.doctors
                    .flatMap((c) => c.doctors)
                    .map((doctor, i) => (
                      <div
                        key={`doctor-${i}`}
                        className="min-w-[35rem] bg-white/90 border border-slate-900 rounded-2xl p-6 shadow-xl"
                      >
                        <h3 className="text-4xl font-bold text-slate-800 mb-2">
                          {doctor.name}
                        </h3>
                        <p className="text-slate-600 mb-4 text-2xl">
                          {doctor.address}
                        </p>
                        <div className="space-y-2 text-2xl">
                          {doctor.tel && (
                            <div className="flex items-center gap-2">
                              <Phone className="text-blue-500" />{" "}
                              {Array.isArray(doctor.tel)
                                ? doctor.tel.join(", ")
                                : doctor.tel}
                            </div>
                          )}
                          {doctor.mobile && (
                            <div className="flex items-center gap-2">
                              <Phone className="text-green-500" />{" "}
                              {Array.isArray(doctor.mobile)
                                ? doctor.mobile.join(", ")
                                : doctor.mobile}
                            </div>
                          )}
                          {doctor.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="text-red-900" />{" "}
                              {Array.isArray(doctor.email)
                                ? doctor.email.join(", ")
                                : doctor.email}
                            </div>
                          )}
                          {doctor.facebook && (
                            <div className="flex items-center gap-2 break-all">
                              <i className="bi bi-facebook text-blue-600" />
                              {doctor.facebook}
                            </div>
                          )}
                          {doctor.website && (
                            <div className="flex items-center gap-2 break-all">
                              <Globe className="text-indigo-500" />{" "}
                              {doctor.website}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Labs */}
              {showLabs && (
                <div className="flex gap-2 mb-4">
                  {filteredData.labs
                    .flatMap((c) => c.labs)
                    .map((lab, i) => (
                      <div
                        key={`lab-${i}`}
                        className="min-w-[35rem] bg-white/90 border border-slate-900 rounded-2xl p-6 shadow-xl"
                      >
                        <h3 className="text-4xl font-bold text-slate-800 mb-2">
                          {lab.name}
                        </h3>
                        <p className="text-slate-600 mb-4 text-2xl">
                          {lab.address}
                        </p>
                        <div className="space-y-2 text-2xl">
                          {lab.tel && (
                            <div className="flex items-center gap-2">
                              <Phone className="text-blue-500" />{" "}
                              {Array.isArray(lab.tel)
                                ? lab.tel.join(", ")
                                : lab.tel}
                            </div>
                          )}
                          {lab.mobile && (
                            <div className="flex items-center gap-2">
                              <Phone className="text-green-500" />{" "}
                              {Array.isArray(lab.mobile)
                                ? lab.mobile.join(", ")
                                : lab.mobile}
                            </div>
                          )}
                          {lab.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="text-red-900" />{" "}
                              {Array.isArray(lab.email)
                                ? lab.email.join(", ")
                                : lab.email}
                            </div>
                          )}
                          {lab.facebook && (
                            <div className="flex items-center gap-2 break-all">
                              <i className="bi bi-facebook text-blue-600" />
                              {lab.facebook}
                            </div>
                          )}
                          {lab.website && (
                            <div className="flex items-center gap-2 break-all">
                              <Globe className="text-indigo-500" />{" "}
                              {lab.website}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          );
        })()}
      </main>
    </div>
  );
};

export default HospitalsPage;
