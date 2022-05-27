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


export { EVENT_TYPES, DEFAULT_EVENT, SortType };
