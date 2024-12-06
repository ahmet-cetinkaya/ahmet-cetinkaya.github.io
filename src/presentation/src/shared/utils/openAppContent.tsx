import { Apps } from "~/domain/data/Apps";
import type { AppId } from "~/domain/models/App";
import WelcomeWizardApp from "../../features/welcome/components/WelcomeWizardApp";
import EmailApp from "../../features/contact/components/EmailApp";

export default function openAppContent(appId: AppId) {
  switch (appId) {
    case Apps.welcome:
      return <WelcomeWizardApp />;
    case Apps.email:
      return <EmailApp />;
    default:
      throw new Error(`App (${appId}) not found`);
  }
}
