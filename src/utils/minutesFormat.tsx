import moment from 'moment';

export const minutesFormat = (seconds: number) => {
  const duration = moment.duration(seconds, 'seconds');
  const minutes = Math.floor(duration.asMinutes());
  const secs = duration.seconds();

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
