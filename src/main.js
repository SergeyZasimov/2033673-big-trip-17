import { render, RenderPosition } from './render.js';
import InfoView from './view/info-view.js';
import FiltersView from './view/filters-view.js';
import AppPresenter from './presenter/app-presenter.js';
import EventsModel from './model/events-model.js';
import { generateFilters } from './utils/filter';

const headerContainer = document.querySelector('.page-header');
const headerTripMain = headerContainer.querySelector('.trip-main');
const headerControlsFilters = headerContainer.querySelector('.trip-controls__filters');

const mainContainer = document.querySelector('.page-main');
const mainTripEvents = mainContainer.querySelector('.trip-events');

const eventsModel = new EventsModel();
const filters = generateFilters(eventsModel.events);

render(new InfoView(), headerTripMain, RenderPosition.AFTERBEGIN);
render(new FiltersView(filters), headerControlsFilters);

const eventsPresenter = new AppPresenter(mainTripEvents, eventsModel);
eventsPresenter.init();
