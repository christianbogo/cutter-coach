// src/utils/dateUtils.ts (or wherever you keep utility functions)

/**
 * Adds the correct ordinal suffix (st, nd, rd, th) to a day number.
 * @param day Day of the month (1-31)
 * @returns The day number with its ordinal suffix (e.g., "1st", "22nd")
 */
function getDayWithOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return `${day}th`; // Handles 4th-20th
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

/**
 * Formats a date string ('YYYY-MM-DD') into 'Mon DDth, YY' format.
 * Handles potential invalid date strings gracefully.
 * @param dateString Input date string ('YYYY-MM-DD')
 * @returns Formatted date string (e.g., "Mar 21st, '25") or 'Invalid Date'
 */
export function getDisplayDate(dateString: string | undefined | null): string {
  if (!dateString) {
    return "N/A"; // Handle null or undefined input
  }

  // Split the string to avoid timezone issues with new Date(string)
  const parts = dateString.split("-");
  if (parts.length !== 3) {
    return "Invalid Date Format";
  }

  // Parse parts into numbers (adjust month index for Date constructor)
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Date months are 0-indexed
  const day = parseInt(parts[2], 10);

  // Create Date object using UTC to prevent timezone shifts affecting the date parts
  const date = new Date(Date.UTC(year, month, day));

  // Validate the date components after creation
  if (
    isNaN(date.getTime()) ||
    date.getUTCDate() !== day ||
    date.getUTCMonth() !== month ||
    date.getUTCFullYear() !== year
  ) {
    return "Invalid Date";
  }

  // Format parts
  const monthShort = date.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const dayWithSuffix = getDayWithOrdinalSuffix(date.getUTCDate());
  const yearShort = date.toLocaleDateString("en-US", {
    year: "2-digit",
    timeZone: "UTC",
  });

  return `${monthShort} ${dayWithSuffix}, '${yearShort}`;
}

/**
 * Calculates the age based on a birth date string ('YYYY-MM-DD').
 * Handles potential invalid date strings gracefully.
 * @param birthDate Input birth date string ('YYYY-MM-DD')
 * @returns Age as a number or NaN if the input is invalid
 */
export function calculateAge(birthDate: string | undefined | null): number {
  if (!birthDate) {
    return NaN; // Handle null or undefined input
  }

  const birthParts = birthDate.split("-");
  if (birthParts.length !== 3) {
    return NaN; // Invalid date format
  }

  const birthYear = parseInt(birthParts[0], 10);
  const birthMonth = parseInt(birthParts[1], 10) - 1; // Date months are 0-indexed
  const birthDay = parseInt(birthParts[2], 10);

  const today = new Date();
  let age = today.getFullYear() - birthYear;

  // Adjust for month and day
  if (
    today.getMonth() < birthMonth ||
    (today.getMonth() === birthMonth && today.getDate() < birthDay)
  ) {
    age -= 1;
  }

  return age;
}
