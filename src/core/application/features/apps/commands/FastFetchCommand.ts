import type ICIProgram from "@application/features/system/commands/abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "@application/features/system/commands/abstraction/ICIProgram";
import { TranslationKeys } from "@domain/data/Translations";

export default class FastFetchCommand implements ICIProgram {
  name = "fastfetch";
  description = TranslationKeys.apps_terminal_commands_fastfetch_description;

  constructor(private locale: string) {}

  private static readonly LOGO = `            ######
           #+++++#
          #++++++#
         #+++##++#
        #+++# #++###
       #+++++++++###
      #+++#####++#
     #####    ####`;

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help") || args.includes("-h")) return this.createHelpOutput();

    const info = this.getSystemInfo();

    const logoLines = FastFetchCommand.LOGO.split("\n");
    const maxLogoWidth = Math.max(...logoLines.map((line) => line.length));

    const combinedLines = logoLines.map((logoLine, index) => {
      const infoLine = info[index] || "";
      return `${logoLine.padEnd(maxLogoWidth)}    ${infoLine}`;
    });

    return {
      output: combinedLines.join("\n"),
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private createHelpOutput(): CommandOutput | PromiseLike<CommandOutput> {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}: 
  ${this.name}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private getCPUInfo(): string {
    const cores = navigator.hardwareConcurrency || `{{${TranslationKeys.common_unknown}}}`;
    const userAgent = navigator.userAgent.toLowerCase();

    let architecture = "x86_64";
    if (userAgent.includes("arm")) architecture = "ARM";
    if (userAgent.includes("aarch64")) architecture = "ARM64";
    if (userAgent.includes("x86_32") || userAgent.includes("x86")) architecture = "x86";

    return `${cores} Cores (${architecture})`;
  }

  private getGPUInfo(): string {
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
      if (!gl) throw new Error("WebGL not supported");

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (!debugInfo) throw new Error("WEBGL_debug_renderer_info not supported");

      const renderer =
        gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ||
        `{{${TranslationKeys.apps_terminal_fastfetch_unknown_gpu}}}`;

      // Extract GPU model from renderer string
      const match = renderer.match(/(?:ANGLE \()?([^,]+(?:RTX|GTX|AMD|Intel)[^,/]+)/);
      if (!match) return renderer;

      return match[1].trim();
    } catch {
      return `{{${TranslationKeys.apps_terminal_fastfetch_unknown_gpu}}}`;
    }
  }

  private getSystemInfo(): string[] {
    const { userAgent } = navigator;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
      ? `${(navigator as Navigator & { deviceMemory?: number }).deviceMemory} GB`
      : `{{${TranslationKeys.apps_terminal_fastfetch_unknown_memory}}}`;
    const cpu = this.getCPUInfo();
    const gpu = this.getGPUInfo();

    return [
      "ac@ahmetcetinkaya.me",
      "-------------------",
      `OS: acOS Linux x86_64`,
      `CPU: ${cpu}`,
      `GPU: ${gpu}`,
      `Language: ${this.locale}`,
      `Memory: ${memory}`,
      `Browser: ${this.getBrowserInfo(userAgent)}`,
    ];
  }

  private getBrowserInfo(userAgent: string): string {
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return `{{${TranslationKeys.common_unknown}}}`;
  }
}
