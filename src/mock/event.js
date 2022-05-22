import { getRandomInteger, getRandomUniqList } from '../utils/common.js';
import { getTestSettings } from './testSettings.js';
import { destinations } from './destination.js';
import { nanoid } from 'nanoid';

const { TEST_EVENT_TYPES, TEST_EVENTS_NUMBER, TEST_DATE_FROM, TEST_DATE_TO, TEST_OFFER_LENGTH, TEST_DESTINATIONS } = getTestSettings();

const generateEvent = () => {
  const generateOffers = getRandomUniqList(TEST_OFFER_LENGTH);

  return {
    basePrice: getRandomInteger(0, 100),
    dateFrom: TEST_DATE_FROM[getRandomInteger(0, TEST_DATE_FROM.length - 1)],
    dateTo: TEST_DATE_TO[getRandomInteger(0, TEST_DATE_TO.length - 1)],
    destination: TEST_DESTINATIONS[getRandomInteger(0, 2)],
    id: nanoid(TEST_EVENTS_NUMBER),
    isFavorite: Boolean(getRandomInteger()),
    offers: generateOffers(),
    type: TEST_EVENT_TYPES[getRandomInteger(0, (TEST_EVENT_TYPES.length - 1))],
  };
};

export { generateEvent };
