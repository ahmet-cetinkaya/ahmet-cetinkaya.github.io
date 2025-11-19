export type Process = {
  pid: number;
  tty: string;
  time: string;
  cmd: string;
  ppid?: number;
  user?: string;
  cpu?: number;
  memory?: number;
  priority?: number;
  createdDate?: Date;
};
