import { TranslationKeys } from "@domain/data/Translations";
import File from "@domain/models/File";
import BaseCommand from "./abstraction/BaseCommand";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

export default class CpCommand extends BaseCommand {
  name = "cp";
  description = TranslationKeys.apps_terminal_commands_cp_description;

  async execute(...args: string[]): Promise<CommandOutput> {
    const result = this.parseTransferArgs(
      args,
      [
        { names: ["-R", "-r", "--recursive"], type: "boolean", key: "recursive" },
        { names: ["-f", "--force"], type: "boolean", key: "force" },
        { names: ["-v", "--verbose"], type: "boolean", key: "verbose" },
        { names: ["-t", "--target-directory"], type: "value", key: "targetDirectory" },
        { names: ["-T", "--no-target-directory"], type: "boolean", key: "noTargetDirectory" },
        { names: ["--help"], type: "boolean", key: "help" },
        { names: ["--version"], type: "boolean", key: "version" },
      ],
      TranslationKeys.apps_terminal_cp_missing_operand,
      this.createHelpOutput(),
    );

    return this.executeTransfer(result, async (sourceEntry, destPath) => {
      const newFile = new File(destPath, sourceEntry.content, new Date(), sourceEntry.size);
      await this.fileSystemService.add(newFile);
      return result.flags.verbose as boolean;
    });
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${TranslationKeys.apps_terminal_commands_cp_description}}}

{{${TranslationKeys.common_usage}}}:
  cp [{{${TranslationKeys.common_options}}}]... <{{${TranslationKeys.common_source}}}>... <{{${TranslationKeys.common_target_directory}}}>

{{${TranslationKeys.common_options}}}:
  -R, -r, --recursive           {{${TranslationKeys.apps_terminal_cp_help_option_recursive}}}
  -f, --force                   {{${TranslationKeys.apps_terminal_cp_help_option_force}}}
  -v, --verbose                 {{${TranslationKeys.apps_terminal_cp_help_option_verbose}}}
  -t, --target-directory=DIR    {{${TranslationKeys.apps_terminal_cp_help_option_target_directory}}}
  -T, --no-target-directory     {{${TranslationKeys.apps_terminal_cp_help_option_no_target_directory}}}
      --help                    {{${TranslationKeys.apps_terminal_cp_help_option_help}}}
      --version                 {{${TranslationKeys.apps_terminal_cp_help_option_version}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
