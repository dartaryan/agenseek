/**
 * Language Detection Utilities
 * Story X.X - Hebrew Display Name Suggestion
 *
 * Utilities for detecting language of display names and validating Hebrew content
 */

/**
 * Detects if a display name is primarily in English (Latin characters)
 * @param name - The display name to check
 * @returns true if name is primarily English (>50% Latin chars)
 */
export function isEnglishName(name: string): boolean {
  if (!name || name.trim().length === 0) return false;
  if (name.length < 2) return false; // Too short to determine

  // Count Latin vs Hebrew characters
  const latinChars = (name.match(/[A-Za-z]/g) || []).length;
  const hebrewChars = (name.match(/[\u0590-\u05FF]/g) || []).length;
  const totalAlphaChars = latinChars + hebrewChars;

  if (totalAlphaChars === 0) return false; // No alphabetic characters

  // Name is "English" if >50% Latin characters
  return latinChars / totalAlphaChars > 0.5;
}

/**
 * Validates that a name contains Hebrew characters
 * @param name - The display name to validate
 * @returns true if name contains at least some Hebrew characters
 */
export function hasHebrewCharacters(name: string): boolean {
  return /[\u0590-\u05FF]/.test(name);
}

