export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatSeconds(value: number) {
  if (value < 60) return `${value}s`;

  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
}
