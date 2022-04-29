import { getRandomInteger } from '../utils.js';
import { getSettings } from '../settings.js';

const { EVENT_TYPES, TEST_EVENTS_NUMBER } = getSettings();

const generateEvent = () => ({
  'basePrice': getRandomInteger(0, 100),
  'dateFrom': '2019-07-10T22:55:56.845Z',
  'dateTo': '2019-07-11T11:22:13.375Z',
  'destination': '',
  'id': getRandomInteger(0, (TEST_EVENTS_NUMBER - 1)),
  'isFavorite': Boolean(getRandomInteger()),
  'offers': '',
  'type': EVENT_TYPES[getRandomInteger(0, (EVENT_TYPES.length - 1))]
});

export { generateEvent };
