import { render, RenderPosition } from './render.js';
import InfoView from './view/info-view.js';
import AppPresenter from './presenter/app-presenter.js';
import EventsModel from './model/events-model.js';
import FiltersModel from './model/filters-model';
import EventsApiService from './api-services/events-api-service';
import DestinationsModel from './model/destinations-model';
import DestinationsApiService from './api-services/destinations-api-service';
import { AUTHORIZATION, END_POINT } from './utils/settings';
import OffersModel from './model/offers-model';

const headerInfo = document.querySelector('.trip-main');
const headerControlsFilters = document.querySelector('.trip-controls__filters');

const mainEventsBoard = document.querySelector('.page-main').querySelector('.trip-events');


render(new InfoView(), headerInfo, RenderPosition.AFTERBEGIN);

const eventsModel = new EventsModel(new EventsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FiltersModel();

const appPresenter = new AppPresenter(
  mainEventsBoard,
  headerInfo,
  headerControlsFilters,
  eventsModel,
  filterModel,
);


OffersModel.init()
  .then(() => DestinationsModel.init())
  .then(() => eventsModel.init());
appPresenter.init();
