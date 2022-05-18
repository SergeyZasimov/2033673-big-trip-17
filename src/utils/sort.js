import dayjs from 'dayjs';

const SortType = {
  DEFAULT: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const dayCompare = (eventA, eventB) => {
  const timeA = dayjs(eventA.dateTo).diff(dayjs(eventA.dateFrom));
  const timeB = dayjs(eventB.dateTo).diff(dayjs(eventB.dateFrom));
  return timeB - timeA;
};

const priceCompare = (eventB, eventA) => eventA.basePrice - eventB.basePrice;

const sorting = {
  [SortType.TIME]: (events) => events.sort(dayCompare),
  [SortType.PRICE]: (events) => events.sort(priceCompare),
};

export { SortType, sorting };
