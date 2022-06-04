import { render, RenderPosition } from './render.js';
import InfoView from './view/info-view.js';
import AppPresenter from './presenter/app-presenter.js';
import EventsModel from './model/events-model.js';
import FiltersModel from './model/filters-model';
import EventsApiService from './api-services/events-api-service';
import OffersModel from './model/offers-model';
import OffersApiService from './api-services/offers-api-service';
import DestinationsModel from './model/destinations-model';
import DestinationsApiService from './api-services/destinations-api-service';

const headerInfo = document.querySelector('.trip-main');
const headerControlsFilters = document.querySelector('.trip-controls__filters');

const mainEventsBoard = document.querySelector('.page-main').querySelector('.trip-events');

const AUTHORIZATION = 'Basic aq38ik$55ks';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';


render(new InfoView(), headerInfo, RenderPosition.AFTERBEGIN);

const eventsModel = new EventsModel(new EventsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FiltersModel();

const appPresenter = new AppPresenter(
  mainEventsBoard,
  headerInfo,
  headerControlsFilters,
  eventsModel,
  filterModel,
  offersModel,
  destinationsModel,
);


offersModel.init()
  .then(() => destinationsModel.init())
  .then(() => eventsModel.init());
appPresenter.init();
