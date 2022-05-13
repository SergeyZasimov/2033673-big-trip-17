import dayjs from 'dayjs';

const FILTER_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const filters = {
  [FILTER_TYPE.EVERYTHING]: (events) => events.some((event) => event.dateFrom),
  [FILTER_TYPE.FUTURE]: (events) => events.some((event) => dayjs(event.dateFrom).isBefore(dayjs())),
  [FILTER_TYPE.PAST]: (events) => events.some((event) => dayjs(event.dateFrom).isAfter(dayjs()))
};

const generateFilters = (events) => Object
  .entries(filters)
  .map(([name, filterIsAvailable]) => ({ name, isAvailable: filterIsAvailable(events) }));

export { generateFilters };
