import { format, formatDistanceToNow } from "date-fns";

export function formatDate(date: Date | string, pattern = "PPP"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, pattern);
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatCurrency(
  amount: number,
  currency = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
