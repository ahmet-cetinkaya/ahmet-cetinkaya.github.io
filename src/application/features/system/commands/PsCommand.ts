import Times from "~/core/acore-ts/data/date/constants/Times";
import DateExtensions from "~/core/acore-ts/data/date/DateExtensions";
import TimeSpan from "~/core/acore-ts/data/date/models/TimeSpan";
import OutputHelper from "~/core/acore-ts/data/output/OutputHelper";
import { TranslationKeys } from "~/domain/data/Translations";
import Window from "~/domain/models/Window";
import type IWindowsService from "../../desktop/services/abstraction/IWindowsService";
import OSVariables from "../constants/OSVariables";
import systemProcesses from "../constants/systemProcesses";
import type { Process } from "../models/Process";
import type ICIProgram from "./abstraction/ICIProgram";
import { ExitCodes, type CommandOutput } from "./abstraction/ICIProgram";

type ColumnDefinition = {
  header: string;
  getValue: (item: Process, index: number) => string;
  minWidth?: number;
};

type ProcessOptions = {
  showAll: boolean;
  fullFormat: boolean;
  longFormat: boolean;
  simpleFormat: boolean;
  sortBy?: string;
  filterByCommand?: string;
  userList?: string[];
  processList?: number[];
};

export default class PsCommand implements ICIProgram {
  name = "ps";
  description = TranslationKeys.apps_terminal_commands_ps_description;

  constructor(private readonly windowsService: IWindowsService) {}

  async execute(...args: string[]): Promise<CommandOutput> {
    if (args.includes("--help")) return this.createHelpOutput();

    const options = this.parseFlags(args);
    const processes = await this.getProcessList(options);
    const formattedOutput = this.formatOutput(processes, options);

    return {
      output: formattedOutput,
      exitCode: ExitCodes.SUCCESS,
    };
  }

  private columns: ColumnDefinition[] = [
    {
      header: "PID",
      getValue: (_, index) => index.toString(),
      minWidth: 5,
    },
    {
      header: "TTY",
      getValue: (item) => ("tty" in item ? item.tty : "?"),
      minWidth: 8,
    },
    {
      header: "TIME",
      getValue: (item) => {
        if ("createdDate" in item) {
          const timeDiff = DateExtensions.getTimeDiff(item.createdDate!);
          return this.formatTime(timeDiff);
        }
        const bootTime = new Date(localStorage.getItem("boot_time") || new Date().toISOString());
        const totalSeconds = (Date.now() - bootTime.getTime()) / 1000;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return this.formatTime(new TimeSpan(hours, minutes, seconds));
      },
      minWidth: 8,
    },
    {
      header: "CMD",
      getValue: (item) => item.cmd,
    },
  ];

  private readonly fullFormatColumns: ColumnDefinition[] = [
    ...this.columns,
    {
      header: "USER",
      getValue: (item) => item.user || OSVariables.DEFAULT_USER,
      minWidth: 8,
    },
    {
      header: "PPID",
      getValue: (item) => (item.ppid ? item.ppid.toString() : "1"),
      minWidth: 5,
    },
    {
      header: "%CPU",
      getValue: (item) => item.cpu?.toFixed(1) ?? "0",
      minWidth: 6,
    },
    {
      header: "%MEM",
      getValue: (item) => item.memory?.toFixed(1) ?? "0",
      minWidth: 6,
    },
  ];

  private getRandomCPUUsage(): string {
    return (Math.random() * 15).toFixed(1);
  }

  private getMemoryUsage(): string {
    return (Math.random() * 8).toFixed(1);
  }

  private parseFlags(args: string[]): ProcessOptions {
    const commandFlagIndex = args.indexOf("-C");
    const filterByCommand = commandFlagIndex !== -1 ? args[commandFlagIndex + 1] : undefined;

    const options = {
      showAll: args.some((arg) => ["-e", "-A"].includes(arg)),
      fullFormat: args.includes("-f"),
      longFormat: args.includes("-l"),
      simpleFormat: args.includes("-s"),
      sortBy: this.getSortOption(args),
      filterByCommand,
      userList: this.getListOption(args, "-u"),
      processList: this.getNumberListOption(args, "-p"),
    };
    return options;
  }

  private getSortOption(args: string[]): string | undefined {
    if (args.includes("--sort=priority")) return "priority";
    if (args.includes("--sort=memory")) return "memory";
    if (args.includes("--sort=cpu")) return "cpu";
    if (args.includes("--sort=pid")) return "pid";
    if (args.includes("--sort=time")) return "time";
    return args.find((arg) => arg.startsWith("--sort="))?.split("=")[1];
  }

  private getListOption(args: string[], flag: string): string[] | undefined {
    const flagIndex = args.indexOf(flag);
    if (flagIndex === -1 || flagIndex + 1 >= args.length) return undefined;

    const values = args[flagIndex + 1];
    return values.split(",");
  }

  private getNumberListOption(args: string[], flag: string): number[] | undefined {
    const items = this.getListOption(args, flag);
    return items?.map(Number);
  }

  private async getProcessList(options: ProcessOptions): Promise<Process[]> {
    const windows = await this.windowsService.getAll();
    let processes = this.combineProcesses(windows);

    if (!options.showAll) processes = processes.filter((p) => p.tty !== "?");

    processes = this.applyFilters(processes, options);

    for (const process of processes) {
      process.memory = Number(this.getMemoryUsage());
      process.cpu = Number(this.getRandomCPUUsage());
    }

    if (options.sortBy) processes = this.sortProcesses(processes, options.sortBy);

    return processes;
  }

  private combineProcesses(windows: Window[]): Process[] {
    return [
      ...systemProcesses,
      ...windows.map(
        (w, i) =>
          ({
            pid: systemProcesses.length + i,
            tty: "?",
            time: this.formatTime(DateExtensions.getTimeDiff(w.createdDate)),
            cmd: w.appId,
            ppid: 1,
            user: OSVariables.DEFAULT_USER,
            cpu: Number(this.getRandomCPUUsage()),
            memory: Number(this.getMemoryUsage()),
            priority: Math.floor(Math.random() * 40) - 20,
          }) as Process,
      ),
    ];
  }

  private applyFilters(processes: Process[], options: ProcessOptions): Process[] {
    let filteredProcesses = [...processes];

    if (options.filterByCommand) {
      filteredProcesses = filteredProcesses.filter((p) =>
        p.cmd.toLowerCase().includes(options.filterByCommand!.toLowerCase()),
      );
    }

    if (options.userList) {
      filteredProcesses = filteredProcesses.filter((p) => p.user && options.userList!.includes(p.user));
    }

    if (options.processList) {
      filteredProcesses = filteredProcesses.filter((p) => options.processList!.includes(p.pid));
    }

    return filteredProcesses;
  }

  private sortProcesses(processes: Process[], sortBy: string): Process[] {
    return [...processes].sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return (b.priority ?? 0) - (a.priority ?? 0);
        case "memory":
          return (b.memory ?? 0) - (a.memory ?? 0);
        case "cpu":
          return (b.cpu ?? 0) - (a.cpu ?? 0);
        case "pid":
          return a.pid - b.pid;
        case "time": {
          const aTime = new TimeSpan(
            Number(a.time.split(":")[0]),
            Number(a.time.split(":")[1]),
            Number(a.time.split(":")[2]),
          );
          const bTime = new TimeSpan(
            Number(b.time.split(":")[0]),
            Number(b.time.split(":")[1]),
            Number(b.time.split(":")[2]),
          );
          return bTime.getTotalSeconds() - aTime.getTotalSeconds();
        }
        default:
          return 0;
      }
    });
  }

  private formatOutput(processes: Process[], options: ProcessOptions): string {
    const columns = options.fullFormat ? this.fullFormatColumns : this.columns;
    return OutputHelper.formatTable(processes, columns);
  }

  private formatTime(timeSpan: TimeSpan): string {
    const totalSeconds = timeSpan.getTotalSeconds();
    const hours = Math.floor(totalSeconds / Times.MILLIS_IN_HOUR)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % Times.MILLIS_IN_MINUTE) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(totalSeconds % Times.SECONDS_IN_MINUTE)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  private createHelpOutput(): CommandOutput {
    return {
      output: `${this.name}: {{${this.description}}}

{{${TranslationKeys.common_usage}}}:
  ps [OPTION]...

{{${TranslationKeys.common_options}}}:
  --help          {{${TranslationKeys.apps_terminal_ps_help_option_help}}}
  -e, -A          {{${TranslationKeys.apps_terminal_ps_help_option_show_all}}}
  -f              {{${TranslationKeys.apps_terminal_ps_help_option_full_format}}}
  -l              {{${TranslationKeys.apps_terminal_ps_help_option_long_format}}}
  -s              {{${TranslationKeys.apps_terminal_ps_help_option_simple_format}}}
  -C <command>    {{${TranslationKeys.apps_terminal_ps_help_option_filter_command}}}
  -u <users>      {{${TranslationKeys.apps_terminal_ps_help_option_user_list}}}
  -p <pids>       {{${TranslationKeys.apps_terminal_ps_help_option_processes}}}
  --sort=<field>  {{${TranslationKeys.apps_terminal_ps_help_option_sort}}}
    priority      {{${TranslationKeys.apps_terminal_ps_help_option_sort_priority}}}
    memory        {{${TranslationKeys.apps_terminal_ps_help_option_sort_memory}}}
    cpu           {{${TranslationKeys.apps_terminal_ps_help_option_sort_cpu}}}`,
      exitCode: ExitCodes.SUCCESS,
    };
  }
}
