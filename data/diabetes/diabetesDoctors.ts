// diabetesDoctors.ts

export interface DiabetesDoctor {
  name: string;
  address: string;
  tel?: string | string[];
  mobile?: string | string[];
  email?: string | string[];
  website?: string;
  facebook?: string;
  notes?: string;
}

export interface CityDoctors {
  city: string;
  doctors: DiabetesDoctor[];
}

export const diabetesDoctors: CityDoctors[] = [
  {
    city: "Angeles",
    doctors: [
      {
        name: "Dr. Rommel G. Malonzo",
        address: "Room 228, AUF Medical Center, MacArthur Hwy, Angeles City, Pampanga 2009",
        mobile: "0985-833-0379",
        notes: "Specializes in internal medicine and diabetes management; clinic located at AUF Medical Center."
      },
      {
        name: "Dr. Edgar S. Nicolas Jr.",
        address: "Room 216, AUF Medical Center, MacArthur Hwy, Angeles City, Pampanga 2009",
        tel: "045-625-2999",
        notes: "Internal medicine specialist at AUF Medical Center; accepts diabetic patients."
      },
      {
        name: "Dr. Carlo Rodrigo S. Carreon, M.D.",
        address: "Room 228, Medical Tower Clinic, AUF Medical Center, MacArthur Hwy, Angeles City, Pampanga 2009",
        tel: "045-625-2999",
        notes: "FPCP, FPSEDM; consults for diabetes and metabolic disorders."
      },
      {
        name: "Nines P. Bautista",
        address: "Room 209, AUF Medical Center, Angeles City",
        mobile: "0998-308-1425",
        notes: "Diabetology clinic listing; specializes in diabetes management."
      },
      {
        name: "Dr. Jose Tranquilino Jr., M.D., FPOA",
        address: "Room 213, Angeles Medical Center, 641 Rizal St., Angeles City, Pampanga",
        mobile: "0932-725-3024",
        notes: "Experienced in diabetes and internal medicine; clinic located at Angeles Medical Center."
      },
      {
        name: "Dr. Eric B. Cruz, M.D.",
        address: "Room 209, 2F Medical Tower Clinic, AUF Medical Center, MacArthur Hwy, Angeles City, Pampanga",
        mobile: "0915-626-6013",
        website: "https://thefilipinodoctor.com/doctor/eric-cruz/clinic-schedule",
        notes: "Nuclear medicine specialist; sees diabetic patients at AUF Medical Center."
      },
      {
        name: "Dr. Leonardo Dungca, M.D.",
        address: "Room 218, Angeles Medical Center, Rizal St., Angeles City, Pampanga 2009",
        mobile: "0969-646-2687",
        notes: "Internal medicine and diabetology consultations."
      },
      {
        name: "Dr. Amiel S. Valerio",
        address: "12 Internal Medicine, Amiel S. Valerio Medical Clinic, Diaserv Building, Zamora St., Sindalan, Angeles City, Pampanga 2009",
        tel: "045-860-5956",
        website: "https://ph948296-dr-amiel-s-valerio.contact.page/",
        notes: "Specializes in diabetes management and internal medicine."
      },
      {
        name: "Dr. Carlo Rodrigo Carreon, M.D., FPCP, FPSEDM",
        address: "Room 210, Angeles Medical Center",
        mobile: "0919-316-9646",
        notes: "FPCP, FPSEDM; consults for diabetes and metabolic disorders."
      }
    ]
  },

  {
    city: "Mabalacat",
    doctors: [
      {
        name: "Dr. Carlo Rodrigo Carreon, M.D.",
        address: "AccuMed Diagnostic Center, MacArthur Hwy, Mabalacat City, Pampanga",
        mobile: "0916-362-4447",
        notes: "FPCP, FPSEDM; sees diabetic patients in Mabalacat branch."
      }
    ]
  },

  {
    city: "San Fernando",
    doctors: [
      {
        name: "Dr. Jan Kevin Nicdao",
        address: "V.L. Makabali Memorial Hospital, B. Mendoza St., San Fernando City, Pampanga",
        tel: "045-961-2234",
        email: "makabali_hospital@yahoo.com",
        website: "https://vlmakabalihospital.com.ph/doctor/dr-jan-jevin-nicdao/",
        notes: "Internal medicine and diabetes specialist; consults at VL Makabali Memorial Hospital."
      },
      {
        name: "Dr. Glenn Michael Ramos, M.D.",
        address: "Online Clinic via NowServing App",
        mobile: "0992-223-5891",
        website: "https://seriousmd.com/doc/glennmichael-ramos",
        notes: "Provides online consultations for diabetes patients; app-based clinic."
      },
      {
        name: "Dr. Ma. Felisse Gomez-Tuazon",
        address: "St. Raphael Foundation and Medical Center, MacArthur Hwy, Camachiles, Mabalacat City, Pampanga",
        tel: "045-625-0140",
        email: "felissemd@gmail.com",
        website: "https://endo-society.org.ph/find-endocrinologist/item/ma-felisse-gomez-tuazon/",
        notes: "Endocrinologist and diabetologist; listed on Philippine Endocrine Society."
      }
    ]
  }
];
