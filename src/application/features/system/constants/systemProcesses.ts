import type { Process } from "../models/Process";
import OSVariables from "./OSVariables";

const systemProcesses: Process[] = [
  {
    pid: 1,
    tty: "?",
    cmd: "init",
    time: OSVariables.DEFAULT_TIME,
    user: OSVariables.DEFAULT_USER,
    createdDate: new Date(localStorage.getItem("boot_time") || new Date().toISOString()),
  },
  {
    pid: 2,
    tty: "?",
    cmd: "kthreadd",
    time: OSVariables.DEFAULT_TIME,
    user: OSVariables.DEFAULT_USER,
    createdDate: new Date(localStorage.getItem("boot_time") || new Date().toISOString()),
  },
  {
    pid: 3,
    tty: "?",
    cmd: "rcu_gp",
    time: OSVariables.DEFAULT_TIME,
    user: OSVariables.DEFAULT_USER,
    createdDate: new Date(localStorage.getItem("boot_time") || new Date().toISOString()),
  },
  {
    pid: 4,
    tty: "?",
    cmd: "kworker/0:0",
    time: OSVariables.DEFAULT_TIME,
    user: OSVariables.DEFAULT_USER,
    createdDate: new Date(localStorage.getItem("boot_time") || new Date().toISOString()),
  },
  {
    pid: 5,
    tty: "tty1",
    cmd: "bash",
    time: OSVariables.DEFAULT_TIME,
    user: OSVariables.DEFAULT_USER,
    createdDate: new Date(localStorage.getItem("boot_time") || new Date().toISOString()),
  },
];
export default systemProcesses;
