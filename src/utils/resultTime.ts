export const formatResultTime = (
  resultSeconds: number | null | undefined
): string => {
  if (resultSeconds === null || resultSeconds === undefined) return "N/A";
  if (isNaN(resultSeconds)) return "Invalid Time";

  const minutes = Math.floor(resultSeconds / 60);
  const seconds = resultSeconds % 60;

  if (resultSeconds < 60) {
    return `${seconds.toFixed(2)}`;
  }

  return `${minutes}:${seconds.toFixed(2).padStart(5, "0")}`;
};
