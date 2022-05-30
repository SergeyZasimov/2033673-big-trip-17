import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import NoEventsView from '../view/no-events-view.js';
import { RenderPosition, render, remove } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import { timeCompare, priceCompare, dayCompare } from '../utils/sort.js';
import { SortType, UpdateType, UserAction } from '../utils/settings.js';
import { filters } from '../utils/filter.js';


export default class AppPresenter {
  #eventsContainer = null;
  #eventsModel = null;
  #filterModel = null;
  #sortComponent = null;
  #noEventsComponent = null;
  #eventsDict = new Map();
  #eventsListComponent = new EventsListView();
  #currentSortType = SortType.DEFAULT;

  constructor(eventsContainer, eventsModel, filterModel) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

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
    this.#renderEventsList();
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderNoEvents = () => {
    this.#noEventsComponent = new NoEventsView(this.#filterModel.filterType)
    render(this.#noEventsComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(
      this.#eventsListComponent.element,
      this.#handleViewAction,
      this.#handleModeChange
    );
    eventPresenter.init(event);
    this.#eventsDict.set(event.id, eventPresenter);
  };

  #renderEventsList = () => {
    if (!this.events.length) {
      this.#renderNoEvents();
    } else {
      this.#renderSort();
      render(this.#eventsListComponent, this.#eventsContainer);

      for (let i = 0; i < this.events.length; i++) {
        this.#renderEvent(this.events[i]);
      }
    }
  };

  #clearEventsList = ({ resetSort = false } = {}) => {
    this.#eventsDict.forEach((presenter) => presenter.destroy());
    this.#eventsDict.clear();

    remove(this.#sortComponent);

    if (resetSort) {
      this.#currentSortType = SortType.DEFAULT;
    }
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
        this.#clearEventsList({ resetSort: true });
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
