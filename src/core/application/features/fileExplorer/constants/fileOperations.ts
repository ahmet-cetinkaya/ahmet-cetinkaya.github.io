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
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
  ],
} as const;
