// utils/dateTimeStamp.js

export function getDateTimeStamp() {
  const now = new Date();

  const pad = (n, len = 2) => n.toString().padStart(len, "0");

  const dd = pad(now.getDate());
  const mm = pad(now.getMonth() + 1);
  const yy = now.getFullYear().toString().slice(-2);
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const ms = pad(now.getMilliseconds(), 3); // milliseconds

  return `${dd}${mm}${yy}${hh}${min}${ss}${ms}`;
}
