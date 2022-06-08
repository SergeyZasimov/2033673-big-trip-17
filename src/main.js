import AppPresenter from './presenter/app-presenter';
import EventsModel from './model/events-model';
import FiltersModel from './model/filters-model';
import EventsApiService from './api-services/events-api-service';
import DestinationsModel from './model/destinations-model';
import { AUTHORIZATION, END_POINT } from './utils/settings';
import OffersModel from './model/offers-model';
import FiltersPresenter from './presenter/filters-presenter';
import InfoPresenter from './presenter/info-presenter';

const eventsModel = new EventsModel(new EventsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FiltersModel();

const filtersPresenter = new FiltersPresenter(eventsModel, filterModel);
const infoPresenter = new InfoPresenter(eventsModel);

const appPresenter = new AppPresenter(
  filtersPresenter,
  infoPresenter,
  eventsModel,
  filterModel,
);

OffersModel.init()
  .then(() => DestinationsModel.init())
  .then(() => eventsModel.init());
appPresenter.init();
