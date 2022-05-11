import { filters } from '../utils/filter.js';

export const generateFilters = (events) => Object
  .entries(filters)
  .map(([name, filterIsAvailable]) => ({ name, isAvailable: filterIsAvailable(events) }));
