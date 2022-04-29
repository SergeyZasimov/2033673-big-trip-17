import { getRandomInteger } from '../utils.js';
import { getSettings } from '../settings.js';

const { EVENT_TYPES } = getSettings();

const generateEvent = () => ({
  'base_price': 1100,
  'date_from': '2019-07-10T22:55:56.845Z',
  'date_to': '2019-07-11T11:22:13.375Z',
  'destination': '',
  'id': '0',
  'is_favorite': false,
  'offers': '',
  'type': EVENT_TYPES[getRandomInteger(0, (EVENT_TYPES.length - 1))]
});

export { generateEvent };
