import moment from "moment-jalaali";

/**
 * Converts a Gregorian (normal) date string to a Jalali date string.
 * @param {string} gregorianDate - A date string in 'YYYY-MM-DD' format.
 * @returns {string} Jalali date in 'jYYYY/jMM/jDD' format.
 */
export function convertToJalali(gregorianDate) {
  if (!gregorianDate) return "";
  return moment(gregorianDate, "YYYY-MM-DD").format("jYYYY/jMM/jDD");
}
