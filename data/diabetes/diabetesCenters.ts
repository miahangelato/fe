// diabetesCenters.ts

export interface DiabetesCenter {
  name: string;
  address: string;
  tel?: string | string[];
  mobile?: string | string[];
  email?: string | string[];
  website?: string;
  facebook?: string;
  notes?: string;
}

export interface CityCenters {
  city: string;
  centers: DiabetesCenter[];
}

export const diabetesCenters: CityCenters[] = [
  {
    city: "Angeles",
    centers: [
      {
        name: "Angeles University Foundation Medical Center (AUF Medical Center)",
        address: "MacArthur Highway / AUF Complex, Angeles City, Pampanga",
        tel: "045-625-2999",
        mobile: ["0919-059-7235", "0917-327-9512"],
        email: "info@aufmc.com.ph",
        website: "https://aufmc.com.ph/",
        notes: "Major tertiary hospital in Angeles offering endocrinology/diabetology services.",
      },
      {
        name: "Sacred Heart Medical Center (Angeles)",
        address: "MacArthur Highway, Sto. Domingo, Angeles City, Pampanga",
        tel: "045-624-5606",
        mobile: "0908-814-5602",
        email: "sacredheartmedicalcenter@yahoo.com",
        website: "http://acsacredheartmedicalcenter.com/",
        facebook: "https://www.facebook.com/acshmcofficial/",
        notes: "Private hospital in Angeles; general and specialty services, including internal medicine.",
      },
      {
        name: "PRI Medical Center",
        address: "Lot 11 Arayat Blvd, Brgy. Pampang, Angeles City, Pampanga",
        tel: ["+63 917 180 8886", "+63 968 888 0999"],
        email: "Info@primconline.com",
        website: "https://primedical.com.ph/",
        facebook: "https://www.facebook.com/PRIMedicalCenter/",
        notes: "DOH-accredited general hospital; rehabilitation and internal medicine services.",
      },
      {
        name: "Ospital Ning Angeles (ONA)",
        address: "Visitacion St. cor Pampang Road, Brgy. Pampang, Angeles City, Pampanga",
        tel: "(045) 322-4495",
        facebook: "https://www.facebook.com/p/Ospital-Ning-Angeles-Management-100068082903021/",
        notes: "City/government hospital (sometimes listed as Rafael Lazatin Memorial Medical Center after upgrades).",
      },
      {
        name: "Our Lady of Mt. Carmel Medical Center - Angeles / Clark listings",
        address: "(See Clark/Main branches) Km.78 MacArthur Hwy (San Fernando) and Lot 4 Ninoy Aquino Ave., Clark Freeport Zone",
        mobile: ["0919-914-9165", "0918-936-8624"],
        email: "patientrelations.clark@olmcmc.com",
        website: "https://olmcmc.com/",
        notes: "OLMCMC has both Clark and San Fernando branches; diabetes/diabetology specialists are listed on their site.",
      },
      {
        name: "Maliwat ENT Medical Clinic",
        address: "1004 Rizal St., Agapito del Rosario, Angeles City, Pampanga",
        mobile: "0961-553-4130",
        email: "maliwatentmedicalclinic@yahoo.com",
        facebook: "https://www.facebook.com/maliwatentmedicalclinic/",
        notes: "Clinic listing and FB confirm practicing schedule (internal medicine / ENT specialist Dr. Maliwat also listed at AUFMC).",
      },
      {
        name: "The Medical City - Angeles",
        address: "76 Sto. Entierro St., Sto. Cristo, Angeles City, Pampanga",
        tel: ["045-887-2882", "045-887-2885"],
        website: "https://www.themedicalcity.com/",
        notes: "Branch of The Medical City network; diabetes services available at The Medical City Clark and network hospitals.",
      },
      {
        name: "Angeles Medical Center - (Dr. Jose Tranquilino P. Jr., MD)",
        address: "Angeles Medical Center, 641 Rizal St., Angeles City, Pampanga",
        tel: ["045-625-9414", "045-888-7150", "045-322-4632"],
        website: "https://www.angelesmed.com/",
        notes: "Dr. Jose Tranquilino and other diabetology/internal medicine doctors have clinic listings here.",
      },
      {
        name: "Pineda Medical Clinic",
        address: "206 Paulette Street Josefa Subdivision, Malabanias, Angeles City, Pampanga",
        mobile: "0961-053-9277",
        facebook: "https://www.facebook.com/profile.php?id=100092741389883",
        notes: "Local private clinic serving Malabanias and nearby barangays.",
      },
    ],
  },

  {
    city: "Mabalacat",
    centers: [
      {
        name: "Tiglao Medical Center Foundation, Inc.",
        address: "10 Imelda Marcos St, Mabalacat City, Pampanga",
        mobile: "0977-421-8843",
        facebook: "https://www.facebook.com/p/Tiglao-Medical-Center-Foundation-Inc-100071678898209/",
        notes: "Local medical center serving Mabalacat and nearby barangays.",
      },
      {
        name: "Mabalacat District Hospital",
        address: "Camachiles / Dau, Mabalacat, Pampanga",
        email: ["mdh_mabalacat@yahoo.com.ph", "mdh@pampanga.gov.ph"],
        notes: "Public district hospital (emails found via local directories).",
      },
      {
        name: "Jon-Jon Medical Clinic & Drugstore - Brgy. Dapdap",
        address: "Santa Rita Avenue, Phase 2, Barangay Dapdap, Mabalacat City",
        mobile: "0999-479-5752",
        facebook: "https://www.facebook.com/jonjonmedical/",
        notes: "Community-level private clinic in Barangay Dapdap.",
      },
      {
        name: "FastMeD Diagnostics - Mabalacat",
        address: "057 FASTMED BUILDING, Lot 7-B, Brgy. Mamatitang, Mabalacat City, Pampanga",
        mobile: "0927-084-7391",
        email: "fastmed.diagnosticsmabalacat@gmail.com",
        facebook: "https://www.facebook.com/p/FastMeD-Diagnostics-Mabalacat-100078824521631/",
        notes: "Diagnostic and laboratory center in Mabalacat.",
      },
      {
        name: "Lagman Qualicare Family Clinic and Pharmacy - Mabalacat (Branch)",
        address: "Fastmed Building, Mabalacat City, Pampanga",
        mobile: "0917-102-2501",
        email: "lqfcmabalacat@gmail.com",
        facebook: "https://www.facebook.com/p/Lagman-Qualicare-Family-Clinic-and-Pharmacy-Mabalacat-Branch-61573488934379/",
        notes: "Branch of Lagman Qualicare; provides family medicine and pharmacy services.",
      },
      {
        name: "BCP Dermatology Clinic (Mabalacat)",
        address: "PG Building, 311-B MacArthur Highway, Mabalacat City, Pampanga",
        tel: "045-332-1172",
        website: "https://ph813416-bcp-dermatology-clinic.contact.page/",
        notes: "Primarily dermatology services; included for clinic availability in Mabalacat.",
      },
    ],
  },

  {
    city: "San Fernando",
    centers: [
      {
        name: "Pampanga Diabetes Care Center (Pampanga Diabetes Clinic)",
        address: "Room 401, Mother Teresa of Calcutta Medical Center, Maimpis, San Fernando City, Pampanga",
        tel: "(045) 455-0776",
        website: "https://ph497602-pampanga-diabetes-care-center.contact.page/",
        notes: "Diabetes-specific clinic located inside MTCMC (Room 401).",
      },
      {
        name: "Nines Bautista Diabetic Clinic (Our Lady of Mt. Carmel Medical Center - San Fernando)",
        address: "Our Lady of Mt. Carmel Medical Center, Km.78 MacArthur Highway, Saguin, San Fernando, Pampanga",
        tel: "(045) 963-4427",
        notes: "Diabetology clinic/consultant listing for Dr. Nines Bautista.",
      },
      {
        name: "Our Lady of Mt. Carmel Medical Center - Main (San Fernando)",
        address: "Kilometer 78, MacArthur Highway, Brgy. Saguin, City of San Fernando, Pampanga",
        mobile: ["0919-914-9165", "0918-936-8624"],
        email: "patientrelations.csfp@olmcmc.com",
        website: "https://olmcmc.com/",
        notes: "Flagship OLMCMC hospital with internal medicine and diabetes services.",
      },
      {
        name: "Jose B. Lingad Memorial General Hospital (JBLMGH)",
        address: "Dolores, City of San Fernando, Pampanga",
        tel: "(045) 409-6688",
        email: ["mcc@jblmgh.com.ph", "finance@jblmgh.doh.gov.ph"],
        website: "https://jblmgh.doh.gov.ph/",
        facebook: "https://www.facebook.com/jblmghpageofficial",
        notes: "DOH regional hospital; offers internal medicine and specialty outpatient services.",
      },
      {
        name: "Eric B. Cruz, M.D. (Clinic at Our Lady of Mt. Carmel Medical Center)",
        address: "Km.78 MacArthur Highway, Brgy. Saguin, City of San Fernando, Pampanga",
        tel: "(045) 435-2420",
        notes: "Clinic listing for Dr. Eric B. Cruz at OLMCMC (nuclear medicine specialist; phone from clinic listings).",
      },
      {
        name: "San Fernandino Hospital, Inc.",
        address: "MacArthur Highway, San Fernando City, Pampanga",
        mobile: "0917-190-1519",
        website: "https://sanfernandinohospitalinc.com/",
        email: "sfhosp@yahoo.com",
        notes: "Private general hospital in San Fernando with internal medicine and diagnostics.",
      },
    ],
  },
];
