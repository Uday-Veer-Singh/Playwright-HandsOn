/**
 * Returns a local date-time value accepted by an HTML datetime-local input.
 */
export function futureDateValue(daysFromToday = 14): string {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysFromToday);
  futureDate.setSeconds(0, 0);

  const timezoneOffsetInMilliseconds =
    futureDate.getTimezoneOffset() * 60 * 1000;

  return new Date(futureDate.getTime() - timezoneOffsetInMilliseconds)
    .toISOString()
    .slice(0, 16);
}
