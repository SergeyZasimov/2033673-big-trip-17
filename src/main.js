import { render, RenderPosition } from './render.js';
import InfoView from './views/info-view.js';
import FiltersView from './views/filters-view.js';
import SortView from './views/sort-view.js';


const headerContainer = document.querySelector('.page-header');
const headerTripMain = headerContainer.querySelector('.trip-main');
const headerControlsFilters = headerContainer.querySelector('.trip-controls__filters');

const mainContainer = document.querySelector('.page-main');
const tripEvents = mainContainer.querySelector('.trip-events');

render(new InfoView(), headerTripMain, RenderPosition.AFTERBEGIN);
render(new FiltersView(), headerControlsFilters);
render(new SortView(), tripEvents);
