export const getDateString = (date: string) => new Date(date).toLocaleDateString();

export const getTimeSinceDate = (firstDate: string, secondDate?: string) => {
  const laterDate = secondDate ? Date.parse(secondDate) : Date.now();

  return Math.round((laterDate - Date.parse(firstDate)) / (1000 * 60 * 60 * 24));
};
