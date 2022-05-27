const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DEFAULT_EVENT = {
  type: '',
  destination: null,
  basePrice: '',
  dateFrom: '',
  dateTo: '',
  id: '',
  offers: [],
};

const SortType = {
  DEFAULT: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};


export { EVENT_TYPES, DEFAULT_EVENT, SortType, Mode, FilterType };
