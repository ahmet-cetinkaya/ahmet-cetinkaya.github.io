export const Icons = {
  computer: {
    "2d": "computer-2d.svg",
    "3d": "computer-3d.glb",
  },
  mail: {
    "2d": "mail-2d.svg",
    "3d": "mail-3d.glb",
  },
  document: {
    "2d": "document-2d.svg",
    "3d": "document-3d.glb",
  },
} as const;

export type IconId = keyof typeof Icons;
