import { TranslationKeys } from "@domain/data/Translations";
import File from "@domain/models/File";
import BaseCommand from "./abstraction/BaseCommand";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

export default class MvCommand extends BaseCommand {
  name = "mv";
  description = TranslationKeys.apps_terminal_commands_mv_description;

  async execute(...args: string[]): Promise<CommandOutput> {
    const result = this.parseTransferArgs(
      args,
      [
        { names: ["-f", "--force"], type: "boolean", key: "force" },
        { names: ["-t", "--target-directory"], type: "value", key: "targetDirectory" },
        { names: ["-T", "--no-target-directory"], type: "boolean", key: "noTargetDirectory" },
        { names: ["-v", "--verbose"], type: "boolean", key: "verbose" },
        { names: ["--help"], type: "boolean", key: "help" },
        { names: ["--version"], type: "boolean", key: "version" },
      ],
      TranslationKeys.apps_terminal_mv_missing_operand,
    );

    if ("error" in result) return result.error;

    const transferResult = await this.forEachValidSource(
      result.sources,
      result.destination,
      this.currentPath,
      async (sourceEntry, destPath) => {
        const destFile = await this.fileSystemService.get((e) => e.fullPath === destPath);
        if (destFile && !result.flags.force) {
          await this.fileSystemService.remove((e) => e.fullPath === destPath);
        }
        const newFile = new File(destPath, sourceEntry.content, sourceEntry.createdDate, sourceEntry.size);
        await this.fileSystemService.add(newFile);
        await this.fileSystemService.remove((e) => e.fullPath === sourceEntry.fullPath);
        return result.flags.verbose as boolean;
      },
    );
    return transferResult ?? { output: "", exitCode: ExitCodes.SUCCESS };
  }
}
