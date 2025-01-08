import { createSignal, For, createEffect, createMemo } from "solid-js";
import { mergeCls } from "~/presentation/src/core/acore-ts/ui/ClassHelpers";
import { TranslationKeys } from "~/domain/data/Translations";
import { useI18n } from "~/presentation/src/shared/utils/i18nTranslate";
import { Paths } from "~/domain/data/Directories";
import type ICIProgram from "~/application/features/system/commands/abstraction/ICIProgram";
import { ExitCodes } from "~/application/features/system/commands/abstraction/ICIProgram";
import PwdCommand from "~/application/features/system/commands/PwdCommand";
import FastFetchCommand from "~/application/features/apps/commands/FastFetchCommand";
import CatCommand from "~/application/features/system/commands/CatCommand";
import CdCommand from "~/application/features/system/commands/CdCommand";
import EchoCommand from "~/application/features/system/commands/EchoCommand";
import LsCommand from "~/application/features/system/commands/LsCommand";
import Container from "~/presentation/Container";
import PathUtils from "~/presentation/src/core/acore-ts/data/path/PathUtils";
import appCommands from "~/presentation/src/shared/constants/AppCommands";
import MkdirCommand from "~/application/features/system/commands/MkdirCommand";
import TouchCommand from "~/application/features/system/commands/TouchCommand";
import RmCommand from "~/application/features/system/commands/RmCommand";
import RmdirCommand from "~/application/features/system/commands/RmdirCommand";
import CpCommand from "~/application/features/system/commands/CpCommand";
import MvCommand from "~/application/features/system/commands/MvCommand";
import FindCommand from "~/application/features/system/commands/FindCommand";
import GrepCommand from "~/application/features/system/commands/GrepCommand";
import CurlCommand from "~/application/features/system/commands/CurlCommand";
import File from "~/domain/models/File";
import HistoryCommand from "~/application/features/system/commands/HistoryCommand";
import WhoamiCommand from "~/application/features/system/commands/WhoamiCommand";
import PsCommand from "~/application/features/system/commands/PsCommand";
import KillCommand from "~/application/features/system/commands/KillCommand";
import { navigate } from "astro:transitions/client";

type CommandEntry = {
  command: string;
  output?: string;
  interrupted?: boolean;
  exitCode?: number;
  path: string;
};
type KeyboardHandler = (e: KeyboardEvent) => void;

const PROMPT_PREFIX = {
  user: "ac",
  separator: ">",
} as const;

type Props = {
  class?: string;
};

export default function Terminal(props: Props) {
  const fileSystemService = Container.instance.fileSystemService;
  const windowsService = Container.instance.windowsService;
  const i18n = Container.instance.i18n;
  const translate = useI18n();

  const [history, setHistory] = createSignal<CommandEntry[]>([]);
  const [currentInput, setCurrentInput] = createSignal("");
  const [historyIndex, setHistoryIndex] = createSignal(-1);
  const [currentPath, setCurrentPath] = createSignal<string>(Paths.USER_HOME);

  const commandHistory = createMemo(() =>
    history()
      .filter((entry) => !entry.interrupted)
      .map((entry) => entry.command)
      .reverse(),
  );

  let inputElement: HTMLInputElement;
  let containerElement: HTMLDivElement;

  const commands = createMemo<Record<string, () => ICIProgram<unknown>>>(() => ({
    cat: () => new CatCommand(fileSystemService, currentPath()),
    cd: () => new CdCommand(fileSystemService, currentPath()),
    cp: () => new CpCommand(fileSystemService, currentPath()),
    curl: () => new CurlCommand(fileSystemService, currentPath()),
    echo: () => new EchoCommand(),
    fastfetch: () => new FastFetchCommand(i18n.currentLocale.get()),
    find: () => new FindCommand(fileSystemService, currentPath()),
    history: () => new HistoryCommand(fileSystemService),
    grep: () => new GrepCommand(fileSystemService, currentPath()),
    ls: () => new LsCommand(fileSystemService, currentPath()),
    kill: () => new KillCommand(windowsService),
    mkdir: () => new MkdirCommand(fileSystemService, currentPath()),
    mv: () => new MvCommand(fileSystemService, currentPath()),
    neofetch: () => new FastFetchCommand(i18n.currentLocale.get()),
    pwd: () => new PwdCommand(),
    ps: () => new PsCommand(windowsService),
    rm: () => new RmCommand(fileSystemService, currentPath()),
    rmdir: () => new RmdirCommand(fileSystemService, currentPath()),
    touch: () => new TouchCommand(fileSystemService, currentPath()),
    whoami: () => new WhoamiCommand(),
    ...appCommands,
  }));

  const keyboardHandlers = createMemo<Record<string, KeyboardHandler>>(() => ({
    Tab: (e) => {
      e.preventDefault();
      handleTabCompletion();
      inputElement.focus();
    },
    ArrowUp: (e) => {
      e.preventDefault();
      navigateHistory(1);
    },
    ArrowDown: (e) => {
      e.preventDefault();
      navigateHistory(-1);
    },
    Enter: () => {
      handleCommand(currentInput());
      setCurrentInput("");
      setHistoryIndex(-1);
    },
  }));
  const ctrlKeyHandlers = createMemo<Record<string, KeyboardHandler>>(() => ({
    l: (e) => {
      e.preventDefault();
      setHistory([]);
      setCurrentInput("");
      inputElement.focus();
    },
    c: (e) => {
      e.preventDefault();
      const command = currentInput();
      setHistory([...history(), { command, interrupted: true, path: currentPath() }]);
      setCurrentInput("");
      inputElement.focus();
    },
  }));

  function onInputMount(input: HTMLInputElement) {
    inputElement = input;
    inputElement.focus();

    inputElement.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        ctrlKeyHandlers()[e.key]?.(e);
        return;
      }
      keyboardHandlers()[e.key]?.(e);
    });
  }

  createEffect(() => {
    history();
    scrollToBottom();
  });

  async function handleCommand(command: string) {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) {
      setHistory([...history(), { command, interrupted: true, path: currentPath(), exitCode: ExitCodes.SUCCESS }]);
      return;
    }

    const [cmd, ...args] = trimmedCommand.match(/(?:[^\s"]+|"[^"]*")+/g)?.map((arg) => arg.replace(/"/g, "")) || [];

    if (cmd.toLowerCase() === "clear") {
      await clearHistory();
      return;
    }

    if (cmd.toLowerCase() === "exit") {
      await windowsService.remove((w) => w.appId === "terminal");
      return;
    }

    const localePathPrefix = i18n.currentLocale.get() === "en" ? "" : `/${i18n.currentLocale.get()}`;
    if (cmd.toLowerCase() === "reboot") {
      navigate(`${localePathPrefix}/reboot`);
      return;
    }

    if (cmd.toLowerCase() === "shutdown") {
      navigate(`${localePathPrefix}/shutdown`);
      return;
    }

    const commandsMap = commands();
    const program = commandsMap[cmd.toLowerCase()];

    const newEntry: CommandEntry = {
      command,
      path: currentPath(),
    };

    if (program) {
      const result = await program().execute(...args);
      newEntry.output = result.output.replaceAll(/{{\s*(\w+)\s*}}/g, (_, key: keyof typeof TranslationKeys) =>
        translate(TranslationKeys[key]),
      );
      newEntry.exitCode = result.exitCode;

      if (cmd === "cd" && result.data) setCurrentPath(result.data as string);

      await updateBashHistoryFile(command);
    } else {
      newEntry.output = `${translate(TranslationKeys.system_terminal_not_found_output)}: ${trimmedCommand}`;
      newEntry.exitCode = ExitCodes.COMMAND_NOT_FOUND;
    }

    setHistory([...history(), newEntry]);
    setHistoryIndex(-1);
  }

  async function clearHistory() {
    setHistory([]);
    // Clear bash history file
    const historyPath = `${Paths.USER_HOME}/.bash_history`;
    const historyFile = (await fileSystemService.get((entry) => entry.fullPath === historyPath)) as File;
    if (historyFile) {
      historyFile.content = "";
      await fileSystemService.update(historyFile);
    }
    return;
  }

  async function updateBashHistoryFile(command: string) {
    const historyPath = `${Paths.USER_HOME}/.bash_history`;
    const historyFile = (await fileSystemService.get((entry) => entry.fullPath === historyPath)) as File;
    if (historyFile) {
      const content = historyFile.content as string;
      const updatedContent = content ? `${content}\n${command}` : command;
      historyFile.content = updatedContent;
      await fileSystemService.update(historyFile);
    }
  }

  async function handleTabCompletion() {
    const input = currentInput().trim();
    const parts = input.split(" ");
    const isCommand = parts.length === 1;

    if (isCommand) {
      const matchingCommand = Object.keys(commands()).find((cmd) => cmd.startsWith(input));
      if (matchingCommand) setCurrentInput(matchingCommand);
    } else {
      const lastArgument = parts.pop()!;
      const matchingPath = await getPathCompletions()(lastArgument);
      if (matchingPath) {
        const newInput = input.replace(new RegExp(`${lastArgument}$`), getReplacementPath(lastArgument, matchingPath));
        setCurrentInput(newInput);
      }
    }
  }

  const getPathCompletions = createMemo(() => async (path: string): Promise<string | null> => {
    const normalizedPath = PathUtils.normalize(currentPath(), path);
    const entry = await fileSystemService.get((entry) => entry.fullPath.startsWith(normalizedPath));
    return entry ? entry.fullPath : null;
  });

  function getReplacementPath(lastArgument: string, matchingPath: string): string {
    const isRelativePath = lastArgument.startsWith("./") || lastArgument.startsWith("../");
    return isRelativePath ? PathUtils.relative(currentPath(), matchingPath) : matchingPath.split("/").pop()!;
  }

  let scrollTimeout: Timer;
  function scrollToBottom() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      containerElement.scrollTop = containerElement.scrollHeight;
    }, 10);
  }

  function navigateHistory(direction: number) {
    const commands = commandHistory();
    const newIndex = historyIndex() + direction;

    if (newIndex >= -1 && newIndex < commands.length) {
      setHistoryIndex(newIndex);
      setCurrentInput(newIndex === -1 ? "" : commands[newIndex]);
    }
  }

  function onClick() {
    inputElement.focus();
  }

  return (
    <div
      ref={(el) => (containerElement = el)}
      class={mergeCls("font-mono flex size-full flex-col overflow-y-auto rounded-lg bg-black p-4", props.class)}
      onClick={onClick}
    >
      <For each={history()}>
        {(entry) => (
          <>
            <pre class="whitespace-pre-wrap">
              <span class="font-bold text-primary-500">
                {PROMPT_PREFIX.user}@{entry.path}
                {PROMPT_PREFIX.separator}
              </span>
              <span class="ml-2">{entry.command}</span>
            </pre>
            {entry.output && (
              <pre
                class={mergeCls("ml-4 whitespace-pre-wrap", {
                  "text-red-500": (entry.exitCode ?? 0) > 0,
                })}
              >
                {entry.output}
                {entry.exitCode !== undefined && (
                  <span
                    class={mergeCls("ml-2 opacity-50", {
                      "text-red-500": (entry.exitCode ?? 0) > 0,
                    })}
                  >
                    [{entry.exitCode}]
                  </span>
                )}
              </pre>
            )}
          </>
        )}
      </For>

      <pre class="flex items-center">
        <CommandLineUserPrefix />
        <input
          ref={onInputMount}
          type="text"
          value={currentInput()}
          onInput={(e) => setCurrentInput(e.currentTarget.value)}
          class="ml-2 flex-1 bg-transparent outline-none"
          spellcheck={false}
          autocomplete="off"
        />
      </pre>
    </div>
  );

  function CommandLineUserPrefix() {
    return (
      <span class="font-bold text-primary-500">
        {PROMPT_PREFIX.user}@{currentPath()}
        {PROMPT_PREFIX.separator}
      </span>
    );
  }
}
