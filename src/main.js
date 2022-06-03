import { render, RenderPosition } from './render.js';
import InfoView from './view/info-view.js';
import AppPresenter from './presenter/app-presenter.js';
import EventsModel from './model/events-model.js';
import FiltersModel from './model/filters-model';

const headerInfo = document.querySelector('.trip-main');
const headerControlsFilters = document.querySelector('.trip-controls__filters');

const mainEventsBoard = document.querySelector('.page-main').querySelector('.trip-events');


render(new InfoView(), headerInfo, RenderPosition.AFTERBEGIN);

const eventsModel = new EventsModel();
const filterModel = new FiltersModel();

const appPresenter = new AppPresenter(mainEventsBoard, headerInfo, headerControlsFilters, eventsModel, filterModel);

appPresenter.init();
