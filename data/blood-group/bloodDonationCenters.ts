// bloodDonationCenters.ts

export interface BloodDonationCenter {
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
  centers: BloodDonationCenter[];
}

export const bloodDonationCenters: CityCenters[] = [
  {
    city: "Angeles",
    centers: [
      {
        name: "St. Catherine of Alexandria Foundation and Medical Center, Inc.",
        address: "Lot 5-6 Block 13 Rizal Extension Brgy, Angeles, 2009 Pampanga",
        mobile: "0998-972-0204",
        email: "scafmc.philippines@gmail.com",
        facebook: "https://www.facebook.com/scafmc.philippines/",
        notes: "Private foundation hospital in Angeles; accepts blood donation and medical services.",
      },
      {
        name: "Angeles University Foundation Medical Center",
        address: "4HWW+32G, MacArthur Hwy, Angeles, 2009 Pampanga",
        tel: "045-625-2999",
        mobile: ["0919-059-7235", "0917-327-9512"],
        email: "info@aufmc.com.ph",
        website: "http://www.aufmc.com.ph/",
        notes: "Major tertiary hospital; regularly conducts blood donation drives through its blood bank.",
      },
      {
        name: "PRI Medical Center",
        address: "Arayat Blvd, Angeles, 2009 Pampanga",
        tel: "045-457-1067",
        mobile: ["0917-180-8886", "0968-888-0999"],
        email: "Info@primconline.com",
        website: "https://primedical.com.ph/",
        notes: "DOH-accredited hospital; facilities include blood donation and laboratory services.",
      },
      {
        name: "Ospital Ning Angeles Multipurpose Cooperative",
        address: "Visitacion St. cor Pampang Road, Brgy. Pampang, Angeles City, Philippines",
        tel: "045-888-8688",
        mobile: "0955-391-5146",
        email: "ona_rlmmc@yahoo.com",
        facebook: "https://www.facebook.com/p/Ospital-Ning-Angeles-Management-100068082903021/",
        notes: "Government-managed cooperative hospital (also known as Rafael Lazatin Memorial Medical Center).",
      },
      {
        name: "Philippine Rehabilitation Center Medical Clinic",
        address: "4HXG+CP5, Lot 11 Arayat Blvd, Angeles, 2009 Pampanga",
        mobile: "0949-654-8521",
        notes: "Clinic-based center; some listings note participation in community health and donation drives.",
      },
      {
        name: "Angeles City Hall",
        address: "5J85+58R, Angeles, Pampanga",
        tel: "045-888-9277",
        website: "https://www.angelescity.gov.ph/",
        notes: "City government often hosts mobile Red Cross / LGU bloodletting activities.",
      },
      {
        name: "Sacred Heart Medical Center",
        address: "Mac Arthur Highway, Sto. Domingo, Angeles City, Philippines",
        tel: "045-624-5606",
        mobile: "0908-814-5602",
        website: "http://acsacredheartmedicalcenter.com/",
        facebook: "https://www.facebook.com/acshmcofficial/",
        notes: "Private hospital in Angeles; has in-house blood bank and blood donation programs.",
      },
      {
        name: "The Medical City Clark",
        address: "100 Gatwick Gateway, Zone, Clark Freeport, Mabalacat City, 2023 Pampanga",
        tel: "045-598-4000",
        mobile: "0919-069-5536",
        email: "themedicalcityclark.com",
        website: "https://www.themedicalcityclark.com/",
        facebook: "https://www.facebook.com/TheMedicalCityClark/",
        notes: "Premier private hospital in Clark; provides blood donation services and transfusion support.",
      },
      {
        name: "Angeles Medical Center, Inc.",
        address: "641 Rizal St., Angeles City, Philippines 2009",
        tel: ["(045) 625-9414", "(045) 888-7150", "(045) 322-4632"],
        mobile: "0943-524-1532 (Lab Department)",
        email: [
          "patientcare@angelesmed.com",
          "hr@angelesmed.com",
          "marketing@angelesmed.com"
        ],
        website: "https://www.angelesmed.com/",
        notes: "Private hospital with laboratory and blood bank facilities; hosts donor campaigns.",
      },
      {
        name: "Dr. Amando L. Garcia Medical Center, Inc.",
        address: "Angeles City, Pampanga",
        mobile: "0968-8704-718 (Laboratory section)",
        facebook: "https://www.facebook.com/dalgmchospital/",
        notes: "Private hospital in Angeles; laboratory supports blood testing and donor screening.",
      },
    ],
  },

  {
    city: "Mabalacat",
    centers: [
      {
        name: "St. Raphael Foundation and Medical Center, Inc.",
        address: "MacArthur Highway, cor. Canidha St., Brgy, Camachiles, Mabalacat, Philippines",
        tel: "(045) 331 1288",
        email: "info@straphaelmc.com",
        facebook: "https://www.facebook.com/StRaphaelFMC/",
        website: "https://straphaelmc.com/",
        notes: "Private hospital in Camachiles, Mabalacat; offers laboratory and blood donation services.",
      },
      {
        name: "Mabalacat District Hospital",
        address: "Camachiles, Mabalacat, Philippines",
        email: "mdh_mabalacat@yahoo.com.ph",
        facebook: "https://www.facebook.com/profile.php?id=100090356352203",
        notes: "Government-run district hospital; supports bloodletting and transfusion activities.",
      },
      {
        name: "Mabalacat City Rural Health Unit IV - RHU4",
        address: "Plaza, Mauaque Resettlement Center, 1st Gate, Mabalacat, Mabalacat City, 2010 Pampanga",
        mobile: "0991-704-8101",
        facebook: "https://www.facebook.com/profile.php?id=100059135710735#",
        notes: "LGU rural health unit; coordinates local blood donation programs with DOH/Red Cross.",
      },
      {
        name: "Mabalacat City Hemodialysis Center",
        address: "Phase 1 Resettlement Center, Barangay Sapang Biabas, Mabalacat, Philippines",
        email: "mabalacathemodialysis@gmail.com",
        facebook: "https://www.facebook.com/mchclgu/",
        notes: "City-run hemodialysis center; facilitates blood screening and related donation programs.",
      },
      {
        name: "Adult and Child Medical Clinic - ACMC",
        address: "Destiny Building, MacArthur Highway, Mabiga, Mabalacat, Philippines",
        mobile: "0932-175-7601",
        email: "Calebmiole@yahoo.com",
        facebook: "https://www.facebook.com/acmc2018/",
        notes: "Private clinic in Mabiga with family/child services; listed in local donor directories.",
      },
      {
        name: "Centralle Medical Diagnostics and Polyclinic - Pampanga",
        address: "5HHQ+78M, Dau Access Rd, Mabalacat City, Pampanga",
        tel: "045-624-1024",
        email: "info@centrallemedical.com",
        website: "http://www.centrallemedical.com/",
        notes: "Private diagnostics and polyclinic; participates in health programs including blood donation.",
      },
      {
        name: "Our Lady of Mt. Carmel Medical Center (Clark Branch)",
        address: "Lot 4, Ninoy Aquino Ave., Clark Freeport Zone, Pampanga",
        email: "patientrelations.clark@olmcmc.com",
        mobile: ["0909-605-5862"],
        notes: "Clark branch of OLMCMC; hospital-based blood donation accepted via their blood bank.",
      },
      {
        name: "Mabalacat District Hospital",
        address: "Dau, Mabalacat, Pampanga",
        email: ["mdh_mabalacat@yahoo.com.ph", "mdh@pampanga.gov.ph"],
        notes: "Duplicate entry of district hospital; kept for record as multiple sources list both Camachiles and Dau.",
      },
      {
        name: "Mabalacat Rural Health Unit II (RHU II)",
        address: "Dau, Mabalacat City, Pampanga 2010",
        tel: "+63 45-331-3746",
        email: "rhumabalacat@yahoo.com.ph",
        notes: "Government RHU in Dau; organizes bloodletting drives with partner agencies.",
      },
    ],
  },

  {
    city: "San Fernando",
    centers: [
      {
        name: "Philippine Red Cross Pampanga Blood Center",
        address: "Brgy, Diosdado Macapagal Government Center, Matulungin, San Fernando, Pampanga; 347 Sta Lucia Santo Niño Viejo Rd, San Fernando, Pampanga",
        tel: "045-961-4117",
        mobile: "0918-920-6054",
        email: "pampanga@redcross.org.ph",
        notes: "Main Pampanga blood center operated by the Philippine Red Cross.",
      },
      {
        name: "Central Luzon Regional Blood Center",
        address: "Regional Gov't. Center Park, Main Road Diosdado Macapagal Regional Center, San Fernando, 2000 Pampanga",
        tel: "045-861-3428",
        email: "rvbsp@centralluzon.doh.gov.ph",
        facebook: "https://www.facebook.com/centralluzonregionalbloodcenter/",
        notes: "DOH-run regional blood center serving Central Luzon provinces.",
      },
      {
        name: "Jose B. Lingad Memorial General Hospital (JBLMGH)",
        address: "San Fernando, Pampanga",
        tel: "(045) 409-6688",
        mobile: "0917-899-8727 (24/7 Crisis Hotline)",
        email: ["mcc@jblmgh.com.ph", "jblmrh.recruitment@gmail.com"],
        website: "https://jblmgh.doh.gov.ph/",
        facebook: "https://www.facebook.com/jblmghpageofficial",
        notes: "DOH regional hospital; has its own blood bank and coordinates with Red Cross.",
      },
      {
        name: "V.L. Makabali Memorial Hospital",
        address: "B. Mendoza St, City of San Fernando, Pampanga",
        tel: ["(045) 961-2234", "(045) 961-2284", "(045) 961-2616", "(045) 961-2442"],
        mobile: [
          "0960-937-0533 (Admitting)",
          "0963-415-3509 (Laboratory)",
          "0939-168-2940 (HMO)"
        ],
        email: "makabali_hospital@yahoo.com",
        website: "https://vlmakabalihospital.com.ph/",
        facebook: "https://www.facebook.com/vlmmhi",
        notes: "Private hospital in San Fernando; offers blood donation via its laboratory and blood bank.",
      },
      {
        name: "Philippine Red Cross - Pampanga Chapter (San Fernando / Angeles)",
        address: "Capitol Compound, Sto. Niño, Regional Gov't Center, Maimpis, City of San Fernando, Pampanga",
        tel: "045-961-4117",
        mobile: "0918-920-6054",
        email: "pampanga@redcross.org.ph",
        notes: "Local Pampanga Red Cross chapter office; organizes mobile bloodletting in Angeles & San Fernando.",
      },
      {
        name: "Philippine Red Cross - Angeles City Blood Collecting Unit",
        address: "Regional Government Center, Sto. Niño, City of San Fernando, Pampanga",
        tel: ["045-961-4117", "045-322-7323 (Blood Bank)"],
        mobile: "0918-920-6054",
        email: "pampanga@redcross.org.ph",
        notes: "Red Cross unit for Angeles City donors; office/collection based in San Fernando regional center.",
      },
      {
        name: "Mother Teresa of Calcutta Medical Center",
        address: "MacArthur Hwy., Brgy. Maimpis, San Fernando, Pampanga",
        website: "https://calcuttamed.com.ph/",
        facebook: "https://www.facebook.com/MTCMedicalCenterOfficial",
        notes: "Private hospital; blood donation services through its clinical laboratory and campaigns.",
      },
      {
        name: "OFW Hospital",
        address: "San Fernando, Pampanga",
        website: "http://www.ofwhospital.info",
        notes: "Specialty government hospital for OFWs; provides transfusion services.",
      },
    ],
  },
];
