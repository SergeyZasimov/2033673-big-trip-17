const getSettings = () => ({
  EVENT_TYPES: ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'],
  DEFAULT_EVENT: {
    type: '',
    destination: null,
    basePrice: '',
    dateFrom: '',
    dateTo: '',
    id: '',
    offers: [],
  },
});

export { getSettings };
