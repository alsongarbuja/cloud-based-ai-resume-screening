
export const timestampToDate = (timestamp: unknown): Date => {
  if (
    timestamp &&
    typeof timestamp === "object" &&
    "toDate" in timestamp &&
    typeof timestamp.toDate === "function"
  ) {
    return timestamp.toDate();
  }

  if (
    timestamp &&
    typeof timestamp === "object" &&
    "_seconds" in timestamp
  ) {
    return new Date((timestamp._seconds as number) * 1000);
  }

  return new Date(timestamp as Date);
};
