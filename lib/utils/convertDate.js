import moment from "moment-jalaali";

export function convertToJalali(gregorianDate) {
  if (!gregorianDate) return "";
  
  const m = moment(gregorianDate); // Don't use a format string for Date objects
  if (!m.isValid()) return "";     // Optional: handle invalid dates safely

  return m.format("jYYYY/jMM/jDD");
}
