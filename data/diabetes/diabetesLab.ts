// diabetesLab.ts

export interface DiabetesLab {
  name: string;
  address: string;
  tel?: string | string[];
  mobile?: string | string[];
  email?: string | string[];
  website?: string;
  facebook?: string;
  notes?: string;
}

export interface CityLabs {
  city: string;
  labs: DiabetesLab[];
}

export const diabetesLabs: CityLabs[] = [
  {
    city: "Angeles",
    labs: [
      {
        name: "Bio Assay Diagnostic Center",
        address: "1232 Miranda Street, Pulung Bulu, Angeles City, Pampanga",
        tel: ["(045) 322-2898", "(045) 625-9647"],
        email: "bioassay1232@yahoo.com",
        notes: "Address & contact confirmed via directory listing.",
      },
      {
        name: "Ace Hub Medical Diagnostic Laboratory",
        address: "2nd Floor, Ace Hub Building, Teodoro St., Balibago, Angeles City, Pampanga",
        mobile: ["0925-778-4948", "0917-798-9993"],
        email: "acemedlaboratory@gmail.com",
        facebook: "https://www.facebook.com/acemedlab/",
        notes: "Verified contact numbers via Facebook posts.",
      },
      {
        name: "MDLab Diagnostic Center, Inc.",
        address: "Lot 23 Block 11, 1st St., Balibago, Angeles City, Pampanga",
        tel: "(045) 458-2614",
        email: "mdlab2311@gmail.com",
        notes: "Info confirmed via Waze and provider directory.",
      },
    ],
  },

  {
    city: "Mabalacat",
    labs: [
      {
        name: "BioVie Diagnostic and Medical Corporation",
        address: "Unit 101 Baronesa Place Bldg, MacArthur Hwy, Dau, Mabalacat City, Pampanga",
        mobile: ["0927-076-5170", "0999-963-4621"],
        email: "bioviediagnostic.medcorp@gmail.com",
        facebook: "https://www.facebook.com/BioVieDiagnostic/",
        notes: "Contacts confirmed via Facebook and payment invoice document.",
      },
      {
        name: "BioChem Healthcare Services, Inc.",
        address: "2/F No. 71 MacArthur Hwy, Dau, Mabalacat City, Pampanga",
        tel: "(045) 402-5809",
        mobile: ["0917-721-2672", "0943-705-1200"],
        email: "info@biochem.ph",
        website: "https://www.biochem.ph/",
        facebook: "https://www.facebook.com/biochemph/",
        notes: "Verified from official site and directory listings.",
      },
    ],
  },

  {
    city: "San Fernando",
    labs: [
      {
        name: "PDDL Diagnostic Laboratory",
        address: "442 MacArthur Hwy, San Fernando, Pampanga",
        mobile: "0942-833-3854",
        notes: "Phone & address retrieved from company profile.",
      },
      {
        name: "R & R Holistic Laboratory and Diagnostic Center",
        address: "L2-L4 G&P Bldg., MacArthur Hwy, Sindalan, San Fernando, Pampanga",
        tel: ["(045) 455-3413", "+63 917-510-7445", "+63 932-886-6383"],
        notes: "Verified from official contact page.",
      },
      {
        name: "Clinitech Medical Laboratory",
        address: "MacArthur Hwy, San Fernando, Pampanga",
        tel: "(045) 961-1555",
        facebook: "https://www.facebook.com/clinitechofficial",
        notes: "Listing found in Pampanga directory.",
      },
      {
        name: "Fhey Laboratory & Diagnostic Clinic",
        address: "Abad Santos St., Old Public Market, San Fernando, Pampanga",
        tel: "(045) 477-9443",
        notes: "Address and phone via local directory.",
      },
      {
        name: "Medisense Laboratory Center Inc.",
        address: "Plaza Garcia, San Fernando, Pampanga",
        notes: "Location confirmation via text listing.",
      },
    ],
  },
];
