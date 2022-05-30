import dayjs from 'dayjs';
import { FilterType } from './settings.js';


const filters = {
  [FilterType.EVERYTHING]: (events) => events.filter((event) => event.dateFrom),
  [FilterType.FUTURE]: (events) => events.filter((event) => dayjs(event.dateFrom).isAfter(dayjs())),
  [FilterType.PAST]: (events) => events.filter((event) => dayjs(event.dateFrom).isBefore(dayjs()))
};

export { filters };
