export function haveSameWindowArgs(currentArgs: string[] | undefined, nextArgs: string[] | undefined): boolean {
  const current = currentArgs ?? [];
  const next = nextArgs ?? [];
  return current.length === next.length && current.every((arg, index) => arg === next[index]);
}
