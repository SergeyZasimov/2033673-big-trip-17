import AppPresenter from './presenter/app-presenter';
import EventModel from './model/event-model';
import FilterModel from './model/filter-model';
import EventsApiService from './api-services/events-api-service';
import DestinationModel from './model/destination-model';
import { AUTHORIZATION, END_POINT } from './utils/settings';
import OfferModel from './model/offer-model';
import FilterPresenter from './presenter/filter-presenter';
import InfoPresenter from './presenter/info-presenter';
import SortModel from './model/sort-model';
import SortPresenter from './presenter/sort-presenter';

const eventModel = new EventModel(new EventsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const sortModel = new SortModel();

const filterPresenter = new FilterPresenter(eventModel, filterModel);
const infoPresenter = new InfoPresenter(eventModel);
const sortPresenter = new SortPresenter(sortModel);

const appPresenter = new AppPresenter(
  filterPresenter,
  infoPresenter,
  sortPresenter,
  eventModel,
  filterModel,
  sortModel,
);

OfferModel.init()
  .then(() => DestinationModel.init())
  .then(() => eventModel.init());
appPresenter.init();
