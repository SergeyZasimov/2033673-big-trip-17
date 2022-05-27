import { render, RenderPosition } from './render.js';
import InfoView from './view/info-view.js';
import AppPresenter from './presenter/app-presenter.js';
import EventsModel from './model/events-model.js';
import FilterPresenter from './presenter/filter-presenter';

const headerContainer = document.querySelector('.page-header');
const headerTripMain = headerContainer.querySelector('.trip-main');
const headerControlsFilters = headerContainer.querySelector('.trip-controls__filters');

const mainContainer = document.querySelector('.page-main');
const mainTripEvents = mainContainer.querySelector('.trip-events');

render(new InfoView(), headerTripMain, RenderPosition.AFTERBEGIN);

const eventsModel = new EventsModel();
const eventsPresenter = new AppPresenter(mainTripEvents, eventsModel);
const filterPresenter = new FilterPresenter(headerControlsFilters, eventsModel);

filterPresenter.init();
eventsPresenter.init();
