import dayjs from 'dayjs';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const AUTHORIZATION = 'Basic aq38ik$55ks';

const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

const DEFAULT_EVENT = {
  type: 'taxi',
  destination: null,
  basePrice: '',
  dateFrom: dayjs().toISOString(),
  dateTo: dayjs().toISOString(),
  offers: [],
  isFavorite: false
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

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  FILTER_MINOR: 'FILTER_MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT,'
};

const HTTPMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const BlockerTimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export {
  EVENT_TYPES,
  DEFAULT_EVENT,
  SortType,
  Mode,
  FilterType,
  UserAction,
  UpdateType,
  AUTHORIZATION,
  END_POINT,
  HTTPMethod,
  BlockerTimeLimit,
};
