import EventsListView from '../view/events-list-view';
import NoEventsView from '../view/no-events-view';
import { RenderPosition, render, remove } from '../framework/render';
import EventPresenter from './event-presenter';
import { timeCompare, priceCompare, dayCompare } from '../utils/sort';
import { BlockerTimeLimit, FilterType, SortType, UpdateType, UserAction } from '../utils/settings';
import { filters } from '../utils/filter';
import NewEventPresenter from './new-event-presenter';
import LoadingView from '../view/loading-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { getElements } from '../utils/get-elements';

const { mainBoard } = getElements();

export default class AppPresenter {
  #mainBoard = mainBoard;
  #eventModel = null;
  #filterModel = null;
  #sortModel = null;
  #noEventsComponent = null;
  #eventsListComponent = new EventsListView();
  #eventsDict = new Map();
  #newEventPresenter = null;
  #filterPresenter = null;
  #infoPresenter = null;
  #sortPresenter = null;
  #isLoading = true;
  #loadingComponent = null;
  #uiBlocker = new UiBlocker(BlockerTimeLimit.LOWER_LIMIT, BlockerTimeLimit.UPPER_LIMIT);

  constructor(filterPresenter, infoPresenter, sortPresenter, eventModel, filterModel, sortModel) {
    this.#filterPresenter = filterPresenter;
    this.#infoPresenter = infoPresenter;
    this.#sortPresenter = sortPresenter;
    this.#eventModel = eventModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;

    this.#eventModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
    this.#sortModel.addObserver(this.#modelEventHandler);
  }

  get events() {
    const filterType = this.#filterModel.filterType;
    const events = this.#eventModel.events;
    const filteredEvents = filters[filterType](events);

    switch (this.#sortModel.sortType) {
      case SortType.TIME:
        return filteredEvents.sort(timeCompare);
      case SortType.PRICE:
        return filteredEvents.sort(priceCompare);
    }
    return filteredEvents.sort(dayCompare);
  }

  init = () => {
    this.#renderEventsList();
  };

  #createNoEvents = (filterType) => {
    this.#noEventsComponent = new NoEventsView(filterType);
    render(this.#noEventsComponent, this.#mainBoard, RenderPosition.AFTERBEGIN);
  };

  #createLoadingComponent = () => {
    this.#loadingComponent = new LoadingView();
    render(this.#loadingComponent, this.#mainBoard, RenderPosition.AFTERBEGIN);
  };

  #newEventFormHandler = (action, newEventForm = null) => {
    switch (action) {
      case 'create':
        if (!this.events.length) {
          remove(this.#noEventsComponent);
          this.#createEventsList();
          render(newEventForm, this.#eventsListComponent.element, RenderPosition.AFTERBEGIN);
        } else {
          this.#filterModel.setFilterType(UpdateType.FILTER_MINOR, FilterType.EVERYTHING);
          render(newEventForm, this.#eventsListComponent.element, RenderPosition.AFTERBEGIN);
        }
        break;
      case 'destroy':
        if (!this.#eventModel.events.length) {
          this.#createNoEvents(FilterType.EVERYTHING);
        }
        break;
    }
  };

  #createEventsList = () => {
    remove(this.#eventsListComponent);
    this.#eventsListComponent = new EventsListView();
    render(this.#eventsListComponent, this.#mainBoard);
  };

  #createEvent = (event) => {
    const eventPresenter = new EventPresenter(
      this.#eventsListComponent.element,
      this.#viewActionHandler,
      this.#modeChangeHandler,
      this.#newEventPresenter.destroy,
    );
    eventPresenter.init(event);
    this.#eventsDict.set(event.id, eventPresenter);
  };

  #renderEventsList = () => {
    if (this.#isLoading) {
      this.#createLoadingComponent();
      return;
    }

    if (!this.events.length) {
      this.#sortPresenter.removeSortComponent();
      this.#createNoEvents(this.#filterModel.filterType);
    } else {
      remove(this.#noEventsComponent);
      this.#sortPresenter.init();
      this.#createEventsList();
      this.events.forEach((event) => this.#createEvent(event));
    }
  };

  #clearEventsList = () => {
    this.#eventsDict.forEach((presenter) => presenter.destroy());
    this.#eventsDict.clear();
  };

  #modeChangeHandler = () => {
    this.#eventsDict.forEach((presenter) => presenter.resetView());
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#infoPresenter.init();
        this.#eventsDict.get(data.id).init(data);
        this.#clearEventsList();
        this.#renderEventsList();
        break;
      case UpdateType.MINOR:
        this.#clearEventsList();
        this.#renderEventsList();
        break;
      case UpdateType.FILTER_MINOR:
        this.#filterPresenter.init();
        this.#sortModel.setSortType(UpdateType.MINOR, SortType.DEFAULT);
        break;
      case UpdateType.MAJOR:
        this.#infoPresenter.init();
        this.#filterPresenter.init();
        this.#sortModel.setSortType(UpdateType.MINOR, SortType.DEFAULT);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);

        this.#infoPresenter.init();

        this.#newEventPresenter = new NewEventPresenter(
          this.#viewActionHandler,
          this.#newEventFormHandler);
        this.#newEventPresenter.init();

        this.#filterPresenter.init();
        this.#renderEventsList();
    }
  };

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsDict.get(update.id).setSaving();
        try {
          await this.#eventModel.updateEvent(updateType, update);
        } catch (err) {
          this.#eventsDict.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventModel.addEvent(updateType, update);
        } catch (err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsDict.get(update.id).setDeleting();
        try {
          await this.#eventModel.deleteEvent(updateType, update);
        } catch (err) {
          this.#eventsDict.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };
}
