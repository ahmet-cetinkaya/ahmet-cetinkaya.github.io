import { Apps } from "~/domain/data/Apps";
import type { AppId } from "~/domain/models/App";
import EmailApp from "../../contact/components/EmailApp";
import DosBoxEngine from "../../games/components/DosBoxEngine";
import WelcomeWizardApp from "../../welcome/components/WelcomeWizardApp";

type Props = {
  appId: AppId;
};

export default function AppContent(props: Props) {
  switch (props.appId) {
    case Apps.welcome:
      return <WelcomeWizardApp />;
    case Apps.email:
      return <EmailApp />;
    case Apps.doom:
      return <DosBoxEngine appId={props.appId} />;
    default:
      throw new Error(`App not found: ${props.appId}`);
  }
}
