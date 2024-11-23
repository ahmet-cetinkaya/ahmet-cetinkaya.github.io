export const Translations = {
  aboutMe: {
    en: "About Me",
    tr: "Hakkımda",
  },
  contact: {
    en: "Contact",
    tr: "İletişim",
  },
  apps: {
    en: "Apps",
    tr: "Uygulamalar",
  },
  system: {
    en: "System",
    tr: "Sistem",
  },
} as const;

export type TranslationKey = keyof typeof Translations;
