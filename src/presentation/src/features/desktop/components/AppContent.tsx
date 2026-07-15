import { Apps } from "@domain/data/Apps";
import type { AppId } from "@domain/models/App";
import EmailApp from "@presentation/src/features/email/components/EmailApp";
import DosBoxEngine from "@presentation/src/features/games/components/DosBoxEngine";
import WelcomeWizardApp from "@presentation/src/features/welcome/components/WelcomeWizardApp";
import Terminal from "@presentation/src/features/system/components/Terminal/Terminal";
import FileExplorerApp from "@presentation/src/features/fileExplorer/components/FileExplorerApp";
import TextEditorApp from "@presentation/src/features/textEditor/components/TextEditorApp";
import MediaViewerApp from "@presentation/src/features/mediaViewer/components/MediaViewerApp";

type Props = {
  appId: AppId;
  args?: string[];
  initialPath?: string;
  windowId?: string;
  isVisible?: boolean;
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
      return <Terminal args={props.args} />;
    case Apps.fileExplorer:
      return <FileExplorerApp initialPath={props.initialPath || "/home/ac"} />;
    case Apps.textEditor: {
      const filePath = props.args?.[0];
      const readOnlyArg = props.args?.find((arg) => arg === "--readonly");
      const readOnly = readOnlyArg !== undefined;
      return <TextEditorApp filePath={filePath} readOnly={readOnly} windowId={props.windowId} />;
    }
    case Apps.mediaViewer: {
      const filePath = props.args?.[0];
      return <MediaViewerApp filePath={filePath} windowId={props.windowId} isVisible={props.isVisible ?? true} />;
    }
    default:
      throw new Error(`App not found: ${props.appId}`);
  }
}
