import { Apps } from "~/domain/data/Apps";
import type { AppId } from "~/domain/models/App";
import WelcomeWizardApp from "../../features/welcome/components/WelcomeWizardApp";

export default function openAppContent(appId: AppId) {
  switch (appId) {
    case Apps.welcome:
      return <WelcomeWizardApp />;
    default:
      throw new Error(`App (${appId}) not found`);
  }
}
