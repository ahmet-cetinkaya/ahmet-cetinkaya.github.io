import type { Certification } from "../models/Certification";
import { Organizations } from "./Organizations";
import { TranslationKeys } from "./Translations";

export const CertificationData = [
  {
    id: 1,
    name: TranslationKeys.certificates_1_name,
    organizationId: Organizations.udemy,
    date: new Date("2020-01-01"),
    url: "https://www.udemy.com/certificate/UC-a57fce42-57b6-4311-868e-3da322b4c6f2/",
    descriptionMarkdown: TranslationKeys.certificates_1_description_markdown,
    createdDate: new Date("2024-12-03"),
  },
  {
    id: 2,
    name: TranslationKeys.certificates_2_name,
    organizationId: Organizations.udemy,
    date: new Date("2020-08-01"),
    url: "https://www.udemy.com/certificate/UC-51b9797b-e759-4a56-a83b-980709d40d5c/",
    descriptionMarkdown: TranslationKeys.certificates_2_description_markdown,
    createdDate: new Date("2024-12-03"),
  },
  {
    id: 3,
    name: TranslationKeys.certificates_3_name,
    organizationId: Organizations.udemy,
    date: new Date("2021-01-01"),
    url: "https://www.udemy.com/certificate/UC-e6342db3-1f25-44cd-9a4f-06a70e4c91af/",
    descriptionMarkdown: TranslationKeys.certificates_3_description_markdown,
    createdDate: new Date("2024-12-03"),
  },
  {
    id: 4,
    name: TranslationKeys.certificates_4_name,
    organizationId: Organizations.kodlamaio,
    date: new Date("2021-03-01"),
    url: "https://www.kodlama.io/p/yazilim-gelistirici-yetistirme-kampi",
    descriptionMarkdown: TranslationKeys.certificates_4_description_markdown,
    createdDate: new Date("2024-12-03"),
  },
  {
    id: 5,
    name: TranslationKeys.certificates_5_name,
    organizationId: Organizations.udemy,
    date: new Date("2021-05-01"),
    url: "https://www.udemy.com/certificate/UC-7cb9bbe9-23a2-431a-a2dc-e849b06a40dd/",
    descriptionMarkdown: TranslationKeys.certificates_5_description_markdown,
    createdDate: new Date("2024-12-03"),
  },
  {
    id: 6,
    name: TranslationKeys.certificates_6_name,
    organizationId: Organizations.kodlamaio,
    date: new Date("2021-06-01"),
    url: "https://www.kodlama.io/p/yazilim-gelistirici-yetistirme-kampi2",
    descriptionMarkdown: TranslationKeys.certificates_6_description_markdown,
    createdDate: new Date("2024-12-03"),
  },
  {
    id: 7,
    name: TranslationKeys.certificates_7_name,
    organizationId: Organizations.kodlamaio,
    date: new Date("2021-11-01"),
    url: "https://www.kodlama.io/p/yazilim-gelistirici-yetistirme-kampi-javascript",
    descriptionMarkdown: TranslationKeys.certificates_7_description_markdown,
    createdDate: new Date("2024-12-03"),
  },
  {
    id: 8,
    name: TranslationKeys.certificates_8_name,
    organizationId: Organizations.udemy,
    date: new Date("2022-01-01"),
    url: "https://www.udemy.com/certificate/UC-af366ed6-b7ff-4057-968f-60f1dc421fd4/",
    descriptionMarkdown: TranslationKeys.certificates_8_description_markdown,
    createdDate: new Date("2024-12-03"),
  },
  {
    id: 9,
    name: TranslationKeys.certificates_9_name,
    organizationId: Organizations.mngKargo,
    date: new Date("2022-02-01"),
    url: "https://www.linkedin.com/posts/engindemirog_e%C4%9Fitmenle%C4%9Fini-ve-ment%C3%B6rl%C3%BC%C4%9F%C3%BCn%C3%BC-benim-yapaca%C4%9F%C4%B1m-activity-6879035555317858304-iK5_/",
    descriptionMarkdown: TranslationKeys.certificates_9_description_markdown,
    createdDate: new Date("2024-12-03"),
  },
  {
    id: 10,
    name: TranslationKeys.certificates_10_name,
    organizationId: Organizations.amazonWebService,
    date: new Date("2022-06-01"),
    url: "https://www.aws.amazon.com/",
    descriptionMarkdown: TranslationKeys.certificates_10_description_markdown,
    createdDate: new Date("2024-12-03"),
  },
] as Certification[];