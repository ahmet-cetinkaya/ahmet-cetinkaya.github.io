const createForbiddenCharsRegex = () => {
  const pattern = '[<>:"/\\\\|?*\\x00-\\x08\\x0b\\x0c\\x0e-\\x1f]';
  return new RegExp(pattern);
};

export const FILE_OPERATIONS = {
  COPY_BUFFER_SIZE: 64 * 1024,
  MAX_FILE_SIZE_PREVIEW: 1024 * 1024,
  MAX_FILENAME_LENGTH: 255,
  FORBIDDEN_CHARACTERS: createForbiddenCharsRegex(),
  RESERVED_NAMES: [
    "con",
    "prn",
    "aux",
    "nul",
    "com1",
    "com2",
    "com3",
    "com4",
    "com5",
    "com6",
    "com7",
    "com8",
    "com9",
    "lpt1",
    "lpt2",
    "lpt3",
    "lpt4",
    "lpt5",
    "lpt6",
    "lpt7",
    "lpt8",
    "lpt9",
  ],
} as const;
