import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import NoEventsView from '../view/no-events-view.js';
import { RenderPosition, render, remove } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import { timeCompare, priceCompare, dayCompare } from '../utils/sort.js';
import { FilterType, SortType, UpdateType, UserAction } from '../utils/settings.js';
import { filters } from '../utils/filter.js';
import NewEventButtonView from '../view/new-event-button-view';
import NewEventPresenter from './new-event-presenter';
import FilterPresenter from './filter-presenter';


export default class AppPresenter {
  #mainBoard = null;
  #infoContainer = null;
  #filtersContainer = null;
  #eventsModel = null;
  #filterModel = null;
  #newButtonComponent = null;
  #sortComponent = null;
  #noEventsComponent = null;
  #eventsListComponent = null;
  #eventsDict = new Map();
  #currentSortType = SortType.DEFAULT;
  #newEventPresenter = null;
  #filtersPresenter = null;

  constructor(eventsContainer, infoContainer, filtersContainer, eventsModel, filterModel) {
    this.#mainBoard = eventsContainer;
    this.#infoContainer = infoContainer;
    this.#filtersContainer = filtersContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventsListComponent = new EventsListView();
    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    const filterType = this.#filterModel.filterType;
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
    this.#createFilters();
    this.#createNewButton();
    this.#createSort();
    this.#renderEventsList();
  };

  #createSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#mainBoard, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #rerenderSort = () => {
    remove(this.#sortComponent);
    this.#currentSortType = SortType.DEFAULT;
    this.#createSort();
  };

  #rerenderFilters = () => {
    this.#filterModel.setFilterType(UpdateType.MINOR, FilterType.EVERYTHING);
    this.#filtersPresenter.removeFilters();
    this.#filtersPresenter.init();
  };

  #createNoEvents = () => {
    this.#noEventsComponent = new NoEventsView(this.#filterModel.filterType);
    render(this.#noEventsComponent, this.#mainBoard, RenderPosition.AFTERBEGIN);
  };

  #createNewButton = () => {
    this.#newButtonComponent = new NewEventButtonView();
    render(this.#newButtonComponent, this.#infoContainer);
    this.#newEventPresenter = new NewEventPresenter(
      this.#eventsListComponent.element,
      this.#newButtonComponent,
      this.#filterModel,
      this.#handleViewAction,
      this.#handleModeChange,
      this.#rerenderSort,
      this.#rerenderFilters
    );
    this.#newEventPresenter.init();
  };

  #createFilters = () => {
    this.#filtersPresenter = new FilterPresenter(this.#filtersContainer, this.#eventsModel, this.#filterModel);
    this.#filtersPresenter.init();
  };

  #createEvent = (event) => {
    const eventPresenter = new EventPresenter(
      this.#eventsListComponent.element,
      this.#handleViewAction,
      this.#handleModeChange,
      this.#newEventPresenter.destroy
    );
    eventPresenter.init(event);
    this.#eventsDict.set(event.id, eventPresenter);
  };

  #renderEventsList = () => {
    if (!this.events.length) {
      this.#createNoEvents();
    } else {
      render(this.#eventsListComponent, this.#mainBoard);

      for (let i = 0; i < this.events.length; i++) {
        this.#createEvent(this.events[i]);
      }
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
        this.#rerenderSort();
        this.#renderEventsList();
        break;
      case UpdateType.MAJOR:
        this.#rerenderFilters();
        this.#clearEventsList();
        this.#rerenderSort();
        this.#renderEventsList();
        break;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

}
