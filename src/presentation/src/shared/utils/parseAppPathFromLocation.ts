import Container from "@presentation/Container";
import { Parts as WelcomeWizardAppParts } from "@presentation/src/features/welcome/components/WelcomeWizardApp";

const DEFAULT_APP_PATH = "about-me";

interface AppPathInfo {
  appPath: string;
  args?: string[];
}

export function parseAppPathFromLocation(pathname: string): AppPathInfo {
  const normalizedPath = normalizePathname(pathname);
  const pathSegments = normalizedPath.split("/");

  return {
    appPath: pathSegments[0] || DEFAULT_APP_PATH,
    args: createArgsFromPath(normalizedPath),
  };
}

function normalizePathname(pathname: string): string {
  const i18n = Container.instance.i18n;
  let path = pathname.startsWith("/") ? pathname.slice(1) : pathname;

  // Remove locale prefix if present
  if (i18n.locales.some((lang) => path.startsWith(`${lang}/`))) {
    path = path.split("/").slice(1).join("/");
  }

  return path || DEFAULT_APP_PATH;
}

function createArgsFromPath(path: string): string[] | undefined {
  if (path.startsWith(DEFAULT_APP_PATH)) {
    const pathSegments = path.split("/");
    if (pathSegments.length <= 1) return undefined;

    const part = pathSegments[1];
    const wizardPart = getWelcomeWizardPart(part);
    return [`--part=${wizardPart}`];
  }
}

const WELCOME_WIZARD_PARTS_MAP = {
  bio: WelcomeWizardAppParts.AboutMe,
  cv: WelcomeWizardAppParts.Background,
  tech: WelcomeWizardAppParts.Technologies,
} as const;

function getWelcomeWizardPart(part: string): WelcomeWizardAppParts {
  return WELCOME_WIZARD_PARTS_MAP[part as keyof typeof WELCOME_WIZARD_PARTS_MAP] ?? WelcomeWizardAppParts.Hello;
}
