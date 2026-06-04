export const FILE_TYPE_PATTERNS = {
  IMAGES: /\.(png|jpe?g|gif|svg|bmp|webp|ico)$/i,
  VIDEOS: /\.(mp4|avi|mov|wmv|flv|webm|mkv|3gp)$/i,
  AUDIO: /\.(mp3|wav|ogg|flac|aac|wma|m4a)$/i,
  DOCUMENTS: /\.(pdf|docx?|xlsx?|pptx?|odt|ods|odp|txt|rtf)$/i,
  ARCHIVES: /\.(zip|rar|7z|tar|gz|bz2|xz|zipx)$/i,
  CODE: /\.(js|jsx|ts|tsx|py|java|c|cpp|cs|php|rb|go|rs|swift|kt|scala|html|css|scss|less|xml|json|yaml|yml|toml|ini|sh|bat|ps1|sql)$/i,
  CONFIG: /\.(env|gitignore|dockerfile|eslintrc|prettierrc|tsconfig|babelrc|webpack\.config|vite\.config)$/i,
} as const;
