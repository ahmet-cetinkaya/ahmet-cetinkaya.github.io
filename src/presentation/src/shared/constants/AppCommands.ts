import DoomCommand from "@application/features/apps/commands/DoomCommand";
import EmailCommand from "@application/features/apps/commands/EmailCommand";
import WelcomeWizardCommand from "@application/features/apps/commands/WelcomeWizardCommand";
import TerminalCommand from "@application/features/apps/commands/TerminalCommand";
import FileExplorerCommand from "@application/features/apps/commands/FileExplorerCommand";
import type ICIProgram from "@application/features/system/commands/abstraction/ICIProgram";
import type { Apps } from "@domain/data/Apps";
import Container from "@presentation/Container";

const appCommands: Record<Apps, () => ICIProgram<unknown>> = {
  doom: () => new DoomCommand(Container.instance.windowsService),
  email: () => new EmailCommand(Container.instance.windowsService),
  welcome: () => new WelcomeWizardCommand(Container.instance.windowsService),
  terminal: () => new TerminalCommand(Container.instance.windowsService),
  fileExplorer: () =>
    new FileExplorerCommand(
      Container.instance.fileSystemService,
      Container.instance.windowsService,
      Container.instance as Container,
    ),
};
export default appCommands;
