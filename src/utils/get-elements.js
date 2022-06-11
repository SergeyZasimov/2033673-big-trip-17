const getElements = () => ({
  headerBoard: document.querySelector('.trip-main'),
  mainBoard: document.querySelector('.page-main').querySelector('.trip-events'),
  filterContainer: document.querySelector('.trip-controls__filters'),
});

export { getElements };
