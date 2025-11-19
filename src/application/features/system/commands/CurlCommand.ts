import type IFileSystemService from "@application/features/system/services/abstraction/IFileSystemService";
import { TranslationKeys } from "@domain/data/Translations";
import File from "@domain/models/File";
import PathUtils from "@packages/acore-ts/data/path/PathUtils";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type CurlFlags = {
  request?: string;
  headers: Record<string, string>;
  data?: string;
  output?: string;
  help: boolean;
  version: boolean;
};

export default class CurlCommand implements ICIProgram {
  name = "curl";
  description = TranslationKeys.apps_terminal_commands_curl_description;

  constructor(
    private readonly fileSystemService: IFileSystemService,
    private currentPath: string,
  ) {}

  private parseArgs(args: string[]): { flags: CurlFlags; url?: string } {
    const flags: CurlFlags = {
      headers: {},
      help: false,
      version: false,
    };
    let url: string | undefined;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("-")) {
        switch (arg) {
          case "-X":
          case "--request":
            flags.request = args[++i];
            break;
          case "-H":
          case "--header": {
            const [key, value] = args[++i].split(": ");
            flags.headers[key] = value;
            break;
          }
          case "-d":
          case "--data":
            flags.data = args[++i];
            break;
          case "-o":
          case "--output":
            flags.output = args[++i];
            break;
          case "--help":
            flags.help = true;
            break;
          case "--version":
            flags.version = true;
            break;
        }
      } else {
        url = arg;
      }
    }

    return { flags, url };
  }

  async execute(...args: string[]): Promise<CommandOutput> {
    const { flags, url } = this.parseArgs(args);

    if (flags.help) return this.createHelpOutput();
    if (flags.version) return this.createVersionOutput();

    if (!url) return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_curl_invalid_url}}}`);

    try {
      const response = await this.makeRequest(url, flags);
      const content = await response.text();

      if (flags.output) {
        const outputPath = PathUtils.normalize(this.currentPath, flags.output);
        if (outputPath !== "/" && !outputPath.startsWith("/home"))
          return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_user_permission_denied}}}: ${flags.output}`);

        const file = new File(outputPath, content, new Date(), content.length);
        await this.fileSystemService.add(file);
        return { output: "", exitCode: ExitCodes.SUCCESS };
      }

      return { output: content, exitCode: ExitCodes.SUCCESS };
    } catch (error) {
      return this.createErrorOutput(`{{${TranslationKeys.apps_terminal_curl_request_error}}}: ${error}`);
    }
  }

  private async makeRequest(url: string, flags: CurlFlags): Promise<Response> {
    const options: RequestInit = {
      method: flags.request || "GET",
      headers: flags.headers,
    };

    if (flags.data) {
      options.body = flags.data;
      if (!(options.headers as Record<string, string>)["Content-Type"]) {
        (options.headers as Record<string, string>)["Content-Type"] = "application/x-www-form-urlencoded";
      }
    }

    return fetch(url, options);
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}:
  curl [{{${TranslationKeys.common_options}}}]... <url>

{{${TranslationKeys.common_options}}}:
  -X, --request <command>  {{${TranslationKeys.apps_terminal_curl_help_option_request}}}
  -H, --header <header>    {{${TranslationKeys.apps_terminal_curl_help_option_header}}}
  -d, --data <data>        {{${TranslationKeys.apps_terminal_curl_help_option_data}}}
  -o, --output <file>      {{${TranslationKeys.apps_terminal_curl_help_option_output}}}
      --help               {{${TranslationKeys.apps_terminal_curl_help_option_help}}}
      --version            {{${TranslationKeys.apps_terminal_curl_help_option_version}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createErrorOutput(message: string): CommandOutput {
    return {
      output: `${this.name}: ${message}`,
      exitCode: ExitCodes.GENERAL_ERROR,
    };
  }

  private createVersionOutput(): CommandOutput {
    return { output: "curl version 1.0.0", exitCode: ExitCodes.SUCCESS };
  }
}
