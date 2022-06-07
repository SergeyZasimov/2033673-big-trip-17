import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import NoEventsView from '../view/no-events-view.js';
import { RenderPosition, render, remove } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import { timeCompare, priceCompare, dayCompare } from '../utils/sort.js';
import { BlockerTimeLimit, FilterType, SortType, UpdateType, UserAction } from '../utils/settings.js';
import { filters } from '../utils/filter.js';
import NewEventPresenter from './new-event-presenter';
import LoadingView from '../view/loading-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';


export default class AppPresenter {
  #mainBoard = null;
  #infoContainer = null;
  #eventsModel = null;
  #filtersModel = null;
  #sortComponent = null;
  #noEventsComponent = null;
  #eventsListComponent = null;
  #eventsDict = new Map();
  #currentSortType = SortType.DEFAULT;
  #newEventPresenter = null;
  #filtersPresenter = null;
  #infoPresenter = null;
  #isLoading = true;
  #loadingComponent = null;
  #uiBlocker = new UiBlocker(BlockerTimeLimit.LOWER_LIMIT, BlockerTimeLimit.UPPER_LIMIT);

  constructor(eventsContainer, infoContainer, filtersPresenter, infoPresenter, eventsModel, filterModel) {
    this.#mainBoard = eventsContainer;
    this.#infoContainer = infoContainer;
    this.#filtersPresenter = filtersPresenter;
    this.#infoPresenter = infoPresenter;
    this.#eventsModel = eventsModel;
    this.#filtersModel = filterModel;

    this.#eventsListComponent = new EventsListView();
    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    const filterType = this.#filtersModel.filterType;
    const events = this.#eventsModel.events;
    const filteredEvents = filters[filterType](events);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort(timeCompare);
      case SortType.PRICE:
        return filteredEvents.sort(priceCompare);
    }
    return filteredEvents.sort(dayCompare);
  }

  init = () => {
    this.#infoPresenter.init();
    this.#createFilters();
    this.#renderEventsList();
  };

  createNewEvent = (handleNewEventFormClose) => {
    this.#newEventPresenter = new NewEventPresenter(this.#eventsListComponent.element, this.#handleViewAction, handleNewEventFormClose);
    this.#filtersModel.setFilterType(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
    this.#eventsDict.set('new_event', this.#newEventPresenter);
  };

  #createSort = () => {
    if (this.#sortComponent !== null) {
      remove(this.#sortComponent);
    }
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#mainBoard, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #createNoEvents = () => {
    this.#noEventsComponent = new NoEventsView(this.#filtersModel.filterType);
    render(this.#noEventsComponent, this.#mainBoard, RenderPosition.AFTERBEGIN);
  };

  #createLoadingComponent = () => {
    this.#loadingComponent = new LoadingView();
    render(this.#loadingComponent, this.#mainBoard, RenderPosition.AFTERBEGIN);
  };

  #createFilters = () => {
    this.#filtersPresenter.init();
  };

  #createEvent = (event) => {
    const eventPresenter = new EventPresenter(
      this.#eventsListComponent.element,
      this.#handleViewAction,
      this.#handleModeChange,
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
      this.#createNoEvents();
    } else {
      this.#createSort();
      render(this.#eventsListComponent, this.#mainBoard);
      this.events.forEach((event) => this.#createEvent(event));
    }
  };

  #clearEventsList = () => {
    this.#eventsDict.forEach((presenter) => presenter.destroy());
    this.#eventsDict.clear();
  };

  #handleModeChange = () => {
    this.#eventsDict.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearEventsList();
    this.#renderEventsList();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventsDict.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearEventsList();
        this.#renderEventsList();
        break;
      case UpdateType.MAJOR:
        this.#currentSortType = SortType.DEFAULT;
        this.#createFilters();
        this.#clearEventsList();
        this.#renderEventsList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#createFilters();
        this.#renderEventsList();
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsDict.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch (err) {
          this.#eventsDict.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch (err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsDict.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch (err) {
          this.#eventsDict.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

}
