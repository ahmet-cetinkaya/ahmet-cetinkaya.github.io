import { TranslationKeys } from "~/domain/data/Translations";
import type IWindowsService from "../../desktop/services/abstraction/IWindowsService";
import systemProcesses from "../constants/systemProcesses";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type ParsedFlags = {
  pids: number[];
};

export default class KillCommand implements ICIProgram {
  name = "kill";
  description = TranslationKeys.apps_terminal_commands_kill_description;

  constructor(private readonly windowsService: IWindowsService) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help")) return this.showHelp();
    if (args.length === 0) return this.handleMissingPid();

    const flags = this.parseFlags(args);
    if (flags.pids.length === 0) return this.handleMissingPid();

    // Process each PID
    for (const pid of flags.pids) {
      if (this.isSystemProcess(pid)) {
        return {
          output: `kill: {{${TranslationKeys.system_terminal_sudo_error}}}`,
          exitCode: ExitCodes.PERMISSION_DENIED,
        };
      }

      const windows = await this.windowsService.getAll();
      const windowIndex = pid - (systemProcesses.length + 1);
      const targetWindow = windows[windowIndex];

      if (!targetWindow) {
        return {
          output: `kill: (${pid}) - No such process`,
          exitCode: ExitCodes.GENERAL_ERROR,
        };
      }

      await this.windowsService.remove((w) => w.id === targetWindow.id);
    }

    return {
      output: "",
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private parseFlags(args: string[]): ParsedFlags {
    const pids = args
      .filter((arg) => !arg.startsWith("-"))
      .map(Number)
      .filter((num) => !isNaN(num));

    return { pids };
  }

  private isSystemProcess(pid: number): boolean {
    return systemProcesses.some((process) => process.pid === pid);
  }

  private handleMissingPid(): CommandOutput {
    return {
      output: "kill: usage: kill pid ...",
      exitCode: ExitCodes.GENERAL_ERROR,
    };
  }

  private showHelp(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}: 
  kill [{{${TranslationKeys.common_options}}}]... <pid>...

{{${TranslationKeys.common_options}}}:
  --help  {{${TranslationKeys.apps_terminal_kill_help_option_help}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
