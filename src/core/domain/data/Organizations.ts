import Organization from "@domain/models/Organization";
import Icons from "./Icons";
import { TranslationKeys } from "./Translations";

export enum Organizations {
  antalyaKaratayAnatolianHighSchool = 1,
  ahmetcetinkaya,
  mehmetAkifErsoyUniversity,
  kodlamaio,
  udemy,
  mngKargo,
  amazonWebService,
}

const OrganizationsData = [
  {
    id: Organizations.antalyaKaratayAnatolianHighSchool,
    name: TranslationKeys.organizations_antalya_karatay_anatolian_high_school,
    icon: Icons.meb,
    location: "Antalya, Turkey",
    createdDate: new Date("2024-12-03"),
    websiteUrl: "https://karatayanadolulisesi.meb.k12.tr/",
  },
  {
    id: Organizations.ahmetcetinkaya,
    name: TranslationKeys.organizations_ahmet_cetinkaya,
    icon: Icons.ahmetcetinkayaFilled,
    location: "Antalya, Turkey",
    websiteUrl: "https://ahmetcetinkaya.me/",
    createdDate: new Date("2024-12-03"),
  },
  {
    id: Organizations.mehmetAkifErsoyUniversity,
    name: TranslationKeys.organizations_mehmet_akif_ersoy_university,
    icon: Icons.mehmetAkifErsoyUniversity,
    location: "Burdur, Turkey",
    websiteUrl: "https://www.maku.edu.tr/",
    createdDate: new Date("2024-12-03"),
  },
  {
    id: Organizations.kodlamaio,
    name: TranslationKeys.organizations_kodlamaio,
    icon: Icons.kodlamaio,
    location: "Ankara, Turkey",
    websiteUrl: "https://www.kodlama.io/",
    createdDate: new Date("2024-12-03"),
  },
  {
    id: Organizations.udemy,
    name: TranslationKeys.organizations_udemy,
    icon: Icons.udemy,
    location: "San Francisco, California, USA",
    websiteUrl: "https://www.udemy.com/",
    createdDate: new Date("2024-12-03"),
  },
  {
    id: Organizations.mngKargo,
    name: TranslationKeys.organizations_mng_kargo,
    icon: Icons.mngKargo,
    location: "Ankara, Turkey",
    websiteUrl: "https://www.mngkargo.com.tr/",
    createdDate: new Date("2024-12-03"),
  },
  {
    id: Organizations.amazonWebService,
    name: TranslationKeys.organizations_amazon_web_services,
    icon: Icons.amazonWebServices,
    location: "Seattle, Washington, USA",
    websiteUrl: "https://aws.amazon.com/",
    createdDate: new Date("2024-12-03"),
  },
] as Organization[];
export default OrganizationsData;
