import Education from "../models/Education";
import { Organizations } from "./Organizations";
import { TranslationKeys } from "./Translations";

const EducationData = [
  {
    id: 1,
    organizationId: Organizations.antalyaKaratayAnatolianHighSchool,
    department: TranslationKeys.educations_1_department,
    startDate: new Date("2013-09-01"),
    endDate: new Date("2017-06-01"),
    createdDate: new Date("2024-12-03"),
  },
  {
    id: 2,
    organizationId: Organizations.mehmetAkifErsoyUniversity,
    department: TranslationKeys.educations_2_department,
    startDate: new Date("2018-09-01"),
    endDate: new Date("2023-06-01"),
    createdDate: new Date("2024-12-03"),
    descriptionMarkdown: TranslationKeys.educations_2_description_markdown,
  },
] as Education[];
export default EducationData;
