export function getFormattedTimeFromTimestamp(timestamp: string) {
  const time = new Date(timestamp as string);
  const formattedTime = `${time.getFullYear()}-${String(
    time.getMonth()
  ).padStart(2, "0")}-${String(time.getDate()).padStart(2, "0")} ${String(
    time.getHours()
  ).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}:${String(
    time.getSeconds()
  ).padStart(2, "0")}`;
  return formattedTime;
}

export function getFormattedTimeFromEpoch(epoch: number) {
  let time = new Date(0);
  time.setSeconds(epoch as number);
  const formattedTime = `${time.getFullYear()}-${String(
    time.getMonth()
  ).padStart(2, "0")}-${String(time.getDate()).padStart(2, "0")} ${String(
    time.getHours()
  ).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}:${String(
    time.getSeconds()
  ).padStart(2, "0")}`;
  return formattedTime;
}
