import { Apps } from "@domain/data/Apps";
import type { AppId } from "@domain/models/App";
import EmailApp from "@presentation/src/features/email/components/EmailApp";
import DosBoxEngine from "@presentation/src/features/games/components/DosBoxEngine";
import WelcomeWizardApp from "@presentation/src/features/welcome/components/WelcomeWizardApp";
import Terminal from "@presentation/src/features/system/components/Terminal/Terminal";

type Props = {
  appId: AppId;
  args?: string[];
};

export default function AppContent(props: Props) {
  switch (props.appId) {
    case Apps.welcome: {
      const initialPartArg = props.args?.find((arg) => arg.startsWith("--part"))?.split("=")[1] as string | undefined;
      return <WelcomeWizardApp part={initialPartArg ? Number(initialPartArg) : undefined} />;
    }
    case Apps.email:
      return <EmailApp />;
    case Apps.doom:
      return <DosBoxEngine appId={props.appId} />;
    case Apps.terminal:
      return <Terminal />;
    default:
      throw new Error(`App not found: ${props.appId}`);
  }
}
