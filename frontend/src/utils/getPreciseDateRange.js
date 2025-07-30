export const getPreciseDateRange = (months = 1) => {
  const now = new Date();
  const start = new Date();
  start.setMonth(now.getMonth() - months);
  return { start, end: now };
};
