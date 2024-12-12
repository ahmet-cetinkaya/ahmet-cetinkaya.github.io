import { Apps } from "~/domain/data/Apps";
import type { AppId } from "~/domain/models/App";
import WelcomeWizardApp from "../../welcome/components/WelcomeWizardApp";
import EmailApp from "../../contact/components/EmailApp";

export default function AppContent(props: { appId: AppId }) {
  switch (props.appId) {
    case Apps.welcome:
      return <WelcomeWizardApp />;
    case Apps.email:
      return <EmailApp />;
    default:
      throw new Error(`App not found: ${props.appId}`);
  }
}
