import { render, RenderPosition } from './render.js';
import InfoView from './view/info-view.js';
import AppPresenter from './presenter/app-presenter.js';
import EventsModel from './model/events-model.js';
import FiltersModel from './model/filters-model';
import EventsApiService from './api-services/events-api-service';
import DestinationsModel from './model/destinations-model';
import { AUTHORIZATION, END_POINT } from './utils/settings';
import OffersModel from './model/offers-model';
import NewEventButtonView from './view/new-event-button-view';

const headerInfo = document.querySelector('.trip-main');
const headerControlsFilters = document.querySelector('.trip-controls__filters');

const mainEventsBoard = document.querySelector('.page-main').querySelector('.trip-events');


render(new InfoView(), headerInfo, RenderPosition.AFTERBEGIN);
const newEventButtonComponent = new NewEventButtonView();

const eventsModel = new EventsModel(new EventsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FiltersModel();

const appPresenter = new AppPresenter(
  mainEventsBoard,
  headerInfo,
  headerControlsFilters,
  eventsModel,
  filterModel,
);

const handleNewButtonFormClose = () => {
  newEventButtonComponent.element.removeAttribute('disabled');
};

const handleNewEventButtonClick = () => {
  appPresenter.createNewEvent(handleNewButtonFormClose);
  newEventButtonComponent.element.setAttribute('disabled', true);
};


OffersModel.init()
  .then(() => DestinationsModel.init())
  .then(() => eventsModel.init())
  .finally(() => {
    render(newEventButtonComponent, headerInfo);
    newEventButtonComponent.setNewEventClickHandler(handleNewEventButtonClick);
  });
appPresenter.init();
