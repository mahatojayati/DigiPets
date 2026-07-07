import { MAX_FILE_SIZE_BYTES, ALLOWED_FILE_TYPES, PRESET_AI_PROMPTS } from './constants';

/**
 * Format bytes into readable string (e.g. 1.2 MB)
 */
export const formatBytes = (bytes: number, decimals = 1): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Validate file type and size
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateFile = (file: File): FileValidationResult => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only transparent PNG or WEBP images are supported.'
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File is too large. Maximum allowed size is ${formatBytes(MAX_FILE_SIZE_BYTES)}.`
    };
  }

  return { isValid: true };
};

/**
 * Get a random preset prompt for AI generation
 */
export const getRandomPrompt = (currentPrompt?: string): string => {
  const filtered = PRESET_AI_PROMPTS.filter(p => p !== currentPrompt);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
};
