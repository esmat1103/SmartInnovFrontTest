// firebaseConfig.mjs

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { app } from '../config/firebaseConfig.mjs';

const db = getFirestore(app);

// List of regions with municipalities
const regions = [
  {
    name: "Governorate of Ariana",
    municipalities: [
      "Ariana",
      "La Soukra",
      "Raoued",
      "Kalâat el Andalous",
      "Sidi Thabet",
      "Ettadhamen Mnihla"
    ]
  },
  {
    name: "Governorate of Béja",
    municipalities: [
      "Béja",
      "El Maâgoula",
      "Zahret Medien",
      "Nefza",
      "Téboursouk",
      "Testour",
      "Goubellat",
      "Majaz al Bab"
    ]
  },
  {
    name: "Governorate of Ben Arous",
    municipalities: [
      "Ben Arous",
      "El Mourouj",
      "Hammam Lif",
      "Hammam Chott",
      "Bou Mhel el-Bassatine",
      "Ezzahra",
      "Radès",
      "Mégrine",
      "Mohamedia-Fouchana",
      "Mornag",
      "Khalidia"
    ]
  },
  {
    name: "Governorate of Bizerte",
    municipalities: [
      "Bizerte",
      "Sejnane",
      "Mateur",
      "Menzel Bourguiba",
      "Tinja",
      "Ghar al Milh",
      "Aousja",
      "Menzel Jemil",
      "Menzel Abderrahmane",
      "El Alia",
      "Ras Jebel",
      "Metline",
      "Raf Raf"
    ]
  },
  {
    name: "Governorate of Gabès",
    municipalities: [
      "Gabès",
      "Chenini Nahal",
      "Ghannouch",
      "Métouia",
      "Oudhref",
      "El Hamma",
      "Matmata",
      "Nouvelle Matmata",
      "Mareth"
    ]
  },
  {
    name: "Governorate of Gafsa",
    municipalities: [
      "Gafsa",
      "El Ksar",
      "Moularès",
      "Redeyef",
      "Métlaoui",
      "Mdhila",
      "El Guettar",
      "Sened"
    ]
  },
  {
    name: "Governorate of Jendouba",
    municipalities: [
      "Aïn Draham",
      "Balta-Bou Aouane",
      "Bou Salem",
      "Fernana",
      "Ghardimaou",
      "Jendouba Sud",
      "Jendouba Nord",
      "Oued Meliz",
      "Tabarka"
    ]
  },
  {
    name: "Governorate of Kairouan",
    municipalities: [
      "Bou Hajla",
      "Chebika",
      "Echrarda",
      "El Alâa",
      "Haffouz",
      "Hajeb El Ayoun",
      "Kairouan Nord",
      "Kairouan Sud",
      "Nasrallah",
      "Oueslatia",
      "Sbikha"
    ]
  },
  {
    name: "Governorate of Kasserine",
    municipalities: [
      "El Ayoun",
      "Ezzouhour",
      "Fériana",
      "Foussana",
      "Haïdra",
      "Hassi El Ferid",
      "Jedelienne",
      "Kasserine Nord",
      "Kasserine Sud",
      "Majel Bel Abbès",
      "Sbeïtla",
      "Sbiba",
      "Thala"
    ]
  },
  {
    name: "Governorate of Kebili",
    municipalities: [
      "Kebili",
      "Djemna",
      "Douz",
      "El Golâa",
      "Souk Lahad"
    ]
  },
  {
    name: "Governorate of El Kef",
    municipalities: [
      "El Kef",
      "Nebeur",
      "Touiref",
      "Sakiet Sidi Youssef",
      "Tajerouine",
      "Menzel Salem",
      "Kalaat es Senam",
      "Kalâat Khasba",
      "Jérissa",
      "El Ksour",
      "Dahmani",
      "Sers"
    ]
  },
  {
    name: "Governorate of Mahdia",
    municipalities: [
      "Mahdia",
      "Rejiche",
      "Bou Merdes",
      "Ouled Chamekh",
      "Chorbane",
      "Hebira",
      "Essouassi",
      "El Djem",
      "Kerker",
      "Chebba",
      "Melloulèche",
      "Sidi Alouane",
      "Ksour Essef",
      "El Bradâa"
    ]
  },
  {
    name: "Governorate of Manouba",
    municipalities: [
      "Manouba",
      "Den Den",
      "Douar Hicher",
      "Oued Ellil",
      "Mornaguia",
      "Borj El Amri",
      "Djedeida",
      "Tebourba",
      "El Battan"
    ]
  },
  {
    name: "Governorate of Médenine",
    municipalities: [
      "Medenine",
      "Beni Khedache",
      "Ben Gardane",
      "Zarzis",
      "Houmt El Souk (Djerba)",
      "Midoun (Djerba)",
      "Ajim (Djerba)"
    ]
  },
  {
    name: "Governorate of Monastir",
    municipalities: [
      "Bekalta",
      "Bembla",
      "Beni Hassen",
      "Jemmal",
      "Ksar Hellal",
      "Ksibet el-Médiouni",
      "Moknine",
      "Monastir",
      "Ouerdanine",
      "Sahline",
      "Sayada-Lamta-Bou Hajar",
      "Téboulba",
      "Zéramdine"
    ]
  },
  {
    name: "Governorate of Nabeul",
    municipalities: [
      "Azmour",
      "Béni Khalled",
      "Béni Khiar",
      "Bou Argoub",
      "Dar Allouch",
      "Dar Châabane",
      "El Haouaria",
      "El Maâmoura",
      "El Mida",
      "Grombalia",
      "Hammam Ghezèze",
      "Hammamet",
      "Kélibia",
      "Korba",
      "Korbous",
      "Menzel Bouzelfa",
      "Menzel Horr",
      "Menzel Temime",
      "Nabeul",
      "Soliman",
      "Somâa",
      "Takelsa",
      "Tazarka",
      "Zaouief Djedidi"
    ]
  },
  {
    name: "Governorate of Sfax",
    municipalities: [
      "Sfax",
      "Sakiet Ezzit",
      "Chihia",
      "Sakiet Eddaïer",
      "Gremda",
      "El Ain",
      "Thyna",
      "Agareb",
      "Jebiniana",
      "El Hencha",
      "Menzel Chaker",
      "Ghraïba",
      "Bir Ali Ben Khélifa",
      "Skhira",
      "Mahares",
      "Kerkennah"
    ]
  },
  {
    name: "Governorate of Sidi Bouzid",
    municipalities: [
      "Sidi Bouzid",
      "Menzel Bouzaiane",
      "Jilma",
      "Cebbala Ouled Asker",
      "Meknassy",
      "Regueb",
      "Souk Jedid",
      "Ouled Haffouz",
      "Bir El Hafey",
      "Sidi Ali Ben Aoun"
    ]
  },
  {
    name: "Governorate of Siliana",
    municipalities: [
      "Siliana",
      "Bou Arada",
      "Gaâfour",
      "El Krib",
      "Sidi Bou Rouis",
      "Maktar",
      "Rouhia",
      "Kesra",
      "Bargou",
      "El Aroussa"
    ]
  },
  {
    name: "Governorate of Sousse",
    municipalities: [
      "Sousse",
      "Ksibet Thrayet",
      "Ezzouhour",
      "Zaouiet Sousse",
      "Hammam Sousse",
      "Akouda",
      "Kalâa Kebira",
      "Sidi Bou Ali",
      "Hergla",
      "Enfidha",
      "Bouficha",
      "Sidi El Hani",
      "M'saken",
      "Kalâa Seghira",
      "Messaadine",
      "Kondar"
    ]
  },
  {
    name: "Governorate of Tataouine",
    municipalities: [
      "Tataouine",
      "Bir Lahmar",
      "Ghomrassen",
      "Dehiba",
      "Remada"
    ]
  },
  {
    name: "Governorate of Tozeur",
    municipalities: [
      "Tozeur",
      "Degache",
      "Hamet Jerid",
      "Nafta",
      "Tamerza"
    ]
  },
  {
    name: "Governorate of Tunis",
    municipalities: [
      "Tunis",
      "Le Bardo",
      "Le Kram",
      "La Goulette",
      "Carthage",
      "Sidi Bou Said",
      "La Marsa",
      "Sidi Hassine"
    ]
  },
  {
    name: "Governorate of Zaghouan",
    municipalities: [
      "Zaghouan",
      "Zriba",
      "Bir Mcherga",
      "Djebel Oust",
      "El Fahs",
      "Nadhour"
    ]
  }
];

// Add each region as a document in the "regions" collection
regions.forEach(({ name, municipalities }) => {
  const regionDocRef = doc(collection(db, "governorates"), name);
  setDoc(regionDocRef, { name })
    .then(() => {
      console.log(`Document written for ${name}`);
      // Add municipalities to the "municipalities" subcollection
      const municipalitiesCollectionRef = collection(regionDocRef, "municipalities");
      municipalities.forEach(municipality => {
        addDoc(municipalitiesCollectionRef, { name: municipality })
          .then(() => console.log(`Added municipality ${municipality} for ${name}`))
          .catch(error => console.error(`Error adding municipality ${municipality} for ${name}:`, error));
      });
    })
    .catch((error) => {
      console.error(`Error adding document for ${name}:`, error);
    });
});
