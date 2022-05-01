import { getRandomInteger } from '../utils.js';
import { getTestSettings } from './testSettings.js';
import { offers } from './offer.js';
import { destinations } from './destination.js';

const { TEST_EVENT_TYPES, TEST_EVENTS_NUMBER, TEST_DATE_FROM, TEST_DATE_TO, TEST_DESTINATIONS } = getTestSettings();

const generateEvent = () => {
  const type = TEST_EVENT_TYPES[getRandomInteger(0, (TEST_EVENT_TYPES.length - 1))];

  const eventOffers = offers.find((item) => item.type === type);

  return {
    basePrice: getRandomInteger(0, 100),
    dateFrom: TEST_DATE_FROM[getRandomInteger(0, TEST_DATE_FROM.length - 1)],
    dateTo: TEST_DATE_TO[getRandomInteger(0, TEST_DATE_TO.length - 1)],
    destination: destinations[0],
    id: getRandomInteger(0, (TEST_EVENTS_NUMBER - 1)),
    isFavorite: Boolean(getRandomInteger()),
    offers: eventOffers ? eventOffers.offers : [],
    type,
  };
};

export { generateEvent };
