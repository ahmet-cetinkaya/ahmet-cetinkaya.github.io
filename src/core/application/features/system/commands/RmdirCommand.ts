import { TranslationKeys } from "@domain/data/Translations";
import Directory from "@domain/models/Directory";
import BaseCommand, { filterPositionalArgs, parseBooleanFlags } from "./abstraction/BaseCommand";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type RmdirFlags = {
  ignoreFailOnNonEmpty: boolean;
  parents: boolean;
  verbose: boolean;
  help: boolean;
  version: boolean;
};

export default class RmdirCommand extends BaseCommand {
  name = "rmdir";
  description = TranslationKeys.apps_terminal_commands_rmdir_description;

  private parseArgs(args: string[]): { flags: RmdirFlags; directories: string[] } {
    const flags = parseBooleanFlags(args, {
      ignoreFailOnNonEmpty: ["--ignore-fail-on-non-empty"],
      parents: ["-p", "--parents"],
      verbose: ["-v", "--verbose"],
      help: ["--help"],
      version: ["--version"],
    }) as RmdirFlags;

    return { flags, directories: filterPositionalArgs(args) };
  }

  async execute(...args: string[]): Promise<CommandOutput> {
    return this.runDirectoryCommand(args, this.parseArgs, this.createHelpOutput(), (flags) =>
      this.createRmdirHandler(flags),
    );
  }

  private createRmdirHandler(flags: RmdirFlags) {
    return async (path: string, targetPath: string, messages: string[]): Promise<CommandOutput | null> => {
      const entry = await this.fileSystemService.get((e) => e.fullPath === targetPath);

      if (!entry) return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}`);
      if (!(entry instanceof Directory))
        return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_common_path_required}}}`);

      const children = await this.fileSystemService.getAll((e) => e.fullPath.startsWith(`${targetPath}/`));
      if (children.length > 0 && !flags.ignoreFailOnNonEmpty) {
        return this.createErrorOutput(
          `${this.name}: {{${TranslationKeys.apps_terminal_rmdir_failed_not_empty}}}: ${path}`,
        );
      }

      if (flags.parents) {
        const parts = targetPath.split("/").filter(Boolean);
        for (let i = parts.length; i > 0; i--) {
          const currentPath = `/${parts.slice(0, i).join("/")}`;
          const hasChildren =
            (await this.fileSystemService.getAll((e) => e.fullPath.startsWith(`${currentPath}/`))).length > 0;

          if (!hasChildren || flags.ignoreFailOnNonEmpty) {
            await this.fileSystemService.remove((e) => e.fullPath === currentPath);
            if (flags.verbose)
              messages.push(
                `${this.name}: {{${TranslationKeys.apps_terminal_rmdir_removing_directory}}} '${currentPath}'`,
              );
          }
        }
      } else {
        await this.fileSystemService.remove((e) => e.fullPath === targetPath);
        if (flags.verbose)
          messages.push(`${this.name}: {{${TranslationKeys.apps_terminal_rmdir_removing_directory}}} '${targetPath}'`);
      }

      return null;
    };
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${TranslationKeys.apps_terminal_rmdir_help_description}}}

{{${TranslationKeys.common_usage}}}:
  rmdir [{{${TranslationKeys.common_options}}}]... <{{${TranslationKeys.common_path}}}>

{{${TranslationKeys.common_options}}}:
      --ignore-fail-on-non-empty  {{${TranslationKeys.apps_terminal_rmdir_help_option_ignore_non_empty}}}
  -p, --parents                   {{${TranslationKeys.apps_terminal_rmdir_help_option_parents}}};
  -v, --verbose                   {{${TranslationKeys.apps_terminal_rmdir_help_option_verbose}}}
      --help                      {{${TranslationKeys.apps_terminal_rmdir_help_option_help}}}
      --version                   {{${TranslationKeys.apps_terminal_rmdir_help_option_version}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
