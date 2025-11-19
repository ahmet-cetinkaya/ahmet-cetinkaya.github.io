import type { TranslationKey } from "@domain/data/Translations";

export enum ExitCodes {
  SUCCESS = 0,
  GENERAL_ERROR = 1,
  COMMAND_NOT_FOUND = 127,
  PERMISSION_DENIED = 126,
}

export type CommandOutput<T = unknown> = {
  output: string;
  exitCode: ExitCodes;
  data?: T;
};

export default interface ICIProgram<TData = unknown> {
  name: string;
  description: TranslationKey;

  execute: (...args: string[]) => Promise<CommandOutput<TData>>;
}
