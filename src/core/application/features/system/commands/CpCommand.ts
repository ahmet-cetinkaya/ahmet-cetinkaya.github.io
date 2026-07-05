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
    );

    if ("error" in result) return result.error;

    const transferResult = await this.forEachValidSource(
      result.sources,
      result.destination,
      this.currentPath,
      async (sourceEntry, destPath) => {
        const newFile = new File(destPath, sourceEntry.content, new Date(), sourceEntry.size);
        await this.fileSystemService.add(newFile);
        return result.flags.verbose as boolean;
      },
    );
    return transferResult ?? { output: "", exitCode: ExitCodes.SUCCESS };
  }
}
