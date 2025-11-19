import type CurriculumVitae from "@domain/models/CurriculumVitae";
import { Organizations } from "./Organizations";
import { TranslationKeys } from "./Translations";

const CurriculumVitaeData = [
  {
    id: 1,
    organizationId: Organizations.ahmetcetinkaya,
    role: TranslationKeys.curriculum_vitae_computer_engineering,
    startDate: new Date("2015-06-01"),
    endDate: new Date("2022-07-01"),
    descriptionMarkdown: TranslationKeys.curriculum_vitae_1_description_markdown,
  },
  {
    id: 2,
    organizationId: Organizations.kodlamaio,
    role: TranslationKeys.curriculum_vitae_intern,
    startDate: new Date("2022-07-18"),
    endDate: new Date("2022-08-25"),
    createdDate: new Date("2024-12-03"),
    descriptionMarkdown: TranslationKeys.curriculum_vitae_2_description_markdown,
  },
  {
    id: 3,
    organizationId: Organizations.kodlamaio,
    role: TranslationKeys.curriculum_vitae_software_developer_and_instructor,
    startDate: new Date("2022-08-25"),
    endDate: new Date("2024-09-01"),
    createdDate: new Date("2024-12-03"),
    descriptionMarkdown: TranslationKeys.curriculum_vitae_3_description_markdown,
  },
] as CurriculumVitae[];
export default CurriculumVitaeData;
