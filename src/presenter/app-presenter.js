import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import NoEventsView from '../view/no-events-view.js';
import { RenderPosition, render } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import { timeCompare, priceCompare } from '../utils/sort.js';
import { SortType } from '../utils/settings.js';


export default class AppPresenter {
  #eventsContainer = null;
  #eventsModel = null;
  #filterModel = null;
  #eventsListComponent = new EventsListView();
  #eventsDict = new Map();
  #sortComponent = new SortView();
  #currentSortType = SortType.DEFAULT;

  constructor(eventsContainer, eventsModel, filterModel) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
  }

  get events() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#eventsModel.events].sort(timeCompare);
      case SortType.PRICE:
        return [...this.#eventsModel.events].sort(priceCompare);
    }
    return this.#eventsModel.events;
  }

  init = () => {
    this.#renderEventsList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderNoEvents = () => {
    render(new NoEventsView(), this.#eventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(
      this.#eventsListComponent.element,
      this.#handleEventUpdate,
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

  #clearEventsList = () => {
    this.#eventsDict.forEach((presenter) => presenter.destroy());
    this.#eventsDict.clear();
  };

  #handleEventUpdate = (updatedEvent) => {

    this.#eventsDict.get(updatedEvent.id).init(updatedEvent);
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

  #handleFilterTypeChange = (filterType) => {
    this.#filterModel.filterType = filterType;
  };

}
