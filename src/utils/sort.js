import dayjs from 'dayjs';

const dayCompare = (eventA, eventB) => dayjs(eventA.dateFrom) - dayjs(eventB.dateFrom);

const timeCompare = (eventA, eventB) => {
  const timeA = dayjs(eventA.dateTo).diff(dayjs(eventA.dateFrom));
  const timeB = dayjs(eventB.dateTo).diff(dayjs(eventB.dateFrom));
  return timeB - timeA;
};

const priceCompare = (eventB, eventA) => eventA.basePrice - eventB.basePrice;

export { timeCompare, priceCompare, dayCompare };
