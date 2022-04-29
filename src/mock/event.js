import { getRandomInteger } from '../utils.js';
import {getTestSettings} from './testSettings.js';

const { TEST_EVENT_TYPES, TEST_EVENTS_NUMBER, TEST_DATE_FROM, TEST_DATE_TO } = getTestSettings();

const generateEvent = () => ({
  'basePrice': getRandomInteger(0, 100),
  'dateFrom': TEST_DATE_FROM[0],
  'dateTo': TEST_DATE_TO[0],
  'destination': '',
  'id': getRandomInteger(0, (TEST_EVENTS_NUMBER - 1)),
  'isFavorite': Boolean(getRandomInteger()),
  'offers': '',
  'type': TEST_EVENT_TYPES[getRandomInteger(0, (TEST_EVENT_TYPES.length - 1))]
});

export { generateEvent };
