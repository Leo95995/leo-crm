export const parseItalianDateToUTC = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/");
  const isoString = new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();

  return new Date(isoString);
};

type Operation = "+" | "-";

export const calculateDateFromDay = (
  date: Date,
  days: number,
  operation: Operation
) => {
  const dayFrom = new Date(date);
  if (operation === "+") {
    dayFrom.setDate(date.getDate() + days);
  } else {
    dayFrom.setDate(date.getDate() - days);
  }

  dayFrom.setHours(23, 59, 59, 999);

  return dayFrom;
};
