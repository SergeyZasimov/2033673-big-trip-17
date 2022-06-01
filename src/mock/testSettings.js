const getTestSettings = () => ({
  TEST_EVENTS_NUMBER: 10,
  TEST_DESTINATIONS: ['Amsterdam', 'Chamonix', 'Geneva'],
  TEST_EVENT_TYPES: ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'],
  TEST_DATE_FROM: ['2022-05-29T10:05:56.845Z', '2022-05-29T11:25:56.845Z', '2022-05-30T10:25:56.845Z', '2022-06-01T12:05:56.845Z'],
  TEST_DATE_TO: ['2022-05-30T12:30:13.375Z', '2022-05-30T12:20:13.375Z', '2022-05-31T19:20:13.375Z', '2022-06-01T12:25:56.845Z'],
  TEST_OFFER_LENGTH: 5,
});

export { getTestSettings };
