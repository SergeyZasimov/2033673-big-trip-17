import dayjs from 'dayjs';
import { FilterType } from './settings.js';


const filters = {
  [FilterType.EVERYTHING]: (events) => events.some((event) => event.dateFrom),
  [FilterType.FUTURE]: (events) => events.some((event) => dayjs(event.dateFrom).isBefore(dayjs())),
  [FilterType.PAST]: (events) => events.some((event) => dayjs(event.dateFrom).isAfter(dayjs()))
};

export { filters };
