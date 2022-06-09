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

const eventsModel = new EventModel(new EventsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const sortModel = new SortModel();

const filtersPresenter = new FilterPresenter(eventsModel, filterModel);
const infoPresenter = new InfoPresenter(eventsModel);
const sortPresenter = new SortPresenter(sortModel);

const appPresenter = new AppPresenter(
  filtersPresenter,
  infoPresenter,
  sortPresenter,
  eventsModel,
  filterModel,
  sortModel,
);

OfferModel.init()
  .then(() => DestinationModel.init())
  .then(() => eventsModel.init());
appPresenter.init();
