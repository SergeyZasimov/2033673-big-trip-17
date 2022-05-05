import { render, RenderPosition } from './render.js';
import InfoView from './view/info-view.js';
import FiltersView from './view/filters-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import EventsModel from './model/events-model.js';

const headerContainer = document.querySelector('.page-header');
const headerTripMain = headerContainer.querySelector('.trip-main');
const headerControlsFilters = headerContainer.querySelector('.trip-controls__filters');

const mainContainer = document.querySelector('.page-main');
const mainTripEvents = mainContainer.querySelector('.trip-events');

render(new InfoView(), headerTripMain, RenderPosition.AFTERBEGIN);
render(new FiltersView(), headerControlsFilters);

const eventsModel = new EventsModel();
const eventsPresenter = new EventsPresenter(mainTripEvents, eventsModel);
eventsPresenter.init();
