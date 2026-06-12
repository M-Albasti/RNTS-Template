/**
 * Formats seconds as MM:SS without moment.js.
 * Uses native Math — date-fns is reserved for calendar/date formatting in formateDate.tsx.
 */
export const minutesFormat = (seconds: number): string => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
