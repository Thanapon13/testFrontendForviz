export function formatTime(dateTime) {
  const options = { hour: "2-digit", minute: "2-digit", hour12: true };
  return new Intl.DateTimeFormat("en-US", options).format(dateTime);
}
