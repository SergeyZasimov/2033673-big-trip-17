const getTestSettings = () => ({
  TEST_EVENTS_NUMBER: 15,
  TEST_DESTINATIONS: ['Amsterdam', 'Chamonix', 'Geneva'],
  TEST_EVENT_TYPES: ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'],
  TEST_DATE_FROM: ['2019-07-10T10:25:56.845Z', '2019-07-10T11:25:56.845Z'],
  TEST_DATE_TO: ['2019-07-10T11:30:13.375Z', '2019-07-10T12:20:13.375Z'],
  TEST_OFFER_LENGTH: 5,
});

export { getTestSettings };
