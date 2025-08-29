// Utility to convert Persian numbers to English numbers
const persianToEnglishNumbers = (str) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return str.replace(/[۰-۹]/g, (char) => englishNumbers[persianNumbers.indexOf(char)]);
  };
  
  // Convert Jalali date (YYYY/MM/DD) to Gregorian date (YYYY-MM-DD)
  const convertToGregorian = (jalaliDate) => {
    if (!jalaliDate) return '';
    // Convert Persian numbers to English
    const englishDate = persianToEnglishNumbers(jalaliDate);
    // Assuming jalaliDate is in YYYY/MM/DD format
    const [year, month, day] = englishDate.split('/').map(Number);
    
    // Simple conversion logic (for demonstration; use a library like `jalali-moment` for accurate conversion)
    // Note: This is a simplified approximation. For production, use a library like `moment-jalaali`.
    const jd = jalaliToJD(year, month, day);
    const gregorian = jdToGregorian(jd);
    return `${gregorian[0]}-${String(gregorian[1]).padStart(2, '0')}-${String(gregorian[2]).padStart(2, '0')}`;
  };
  
  // Helper functions for Jalali to Gregorian conversion (simplified; consider using a library)
  function jalaliToJD(jy, jm, jd) {
    const gy = jy + 621;
    const leap = isLeapYear(gy);
    const days = (jm - 1) * 31 + jd - 1;
    return gregorianToJD(gy, 3, 20 + days);
  }
  
  function gregorianToJD(gy, gm, gd) {
    return Math.floor((1461 * (gy + Math.floor((gm - 3) / 12))) / 4) +
           Math.floor((153 * ((gm - 3) % 12 + 1)) / 5) + gd - 32075;
  }
  
  function jdToGregorian(jd) {
    const wjd = Math.floor(jd - 0.5) + 0.5;
    const depoch = wjd - 1721425.5;
    const quadricent = Math.floor(depoch / 146097);
    const dqc = depoch % 146097;
    const cent = Math.floor(dqc / 36524);
    const dcent = dqc % 36524;
    const quad = Math.floor(dcent / 1461);
    const dquad = dcent % 1461;
    const yindex = Math.floor(dquad / 365);
    let year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
    if (cent !== 4 && yindex !== 4) year++;
    const yearday = wjd - gregorianToJD(year, 1, 1);
    const leapadj = yearday < 59 ? 0 : isLeapYear(year) ? 1 : 2;
    const month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    const day = wjd - gregorianToJD(year, month, 1) + 1;
    return [year, month, day];
  }
  
  function isLeapYear(year) {
    return ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? 1 : 0;
  }
  
  export { convertToJalali, convertToGregorian, persianToEnglishNumbers };