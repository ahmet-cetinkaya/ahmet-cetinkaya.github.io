import { twMerge } from "tailwind-merge";

type ClassValue = string | { [key: string]: boolean } | undefined | null;

export function mergeCls(...args: ClassValue[]): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (typeof arg === "string" && arg) {
      classes.push(...arg.trim().split(/\s+/));
    } else if (typeof arg === "object" && arg !== null) {
      for (const [key, value] of Object.entries(arg)) {
        if (!value) continue;
        classes.push(...key.trim().split(/\s+/));
      }
    }
  }
  return twMerge(...classes);
}
