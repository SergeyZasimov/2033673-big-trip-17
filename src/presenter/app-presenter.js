import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import NoEventsView from '../view/no-events-view.js';
import { RenderPosition, render } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import { updateItemList } from '../utils/common.js';
import { sorting, SortType } from '../utils/sort.js';


export default class AppPresenter {
  #eventsContainer = null;
  #eventsModel = null;
  #events = [];
  #defaultSortedEvents = [];
  #eventsListComponent = new EventsListView();
  #eventsDict = new Map();
  #sortComponent = new SortView();
  #currentSortType = SortType.DEFAULT;

  constructor(eventsContainer, eventsModel) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
  }

  init = () => {
    this.#events = [...this.#eventsModel.events];
    this.#defaultSortedEvents = [...this.#events];
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
    if (!this.#events.length) {
      this.#renderNoEvents();
    } else {
      this.#renderSort();
      render(this.#eventsListComponent, this.#eventsContainer);

      for (let i = 0; i < this.#events.length; i++) {
        this.#renderEvent(this.#events[i]);
      }
    }
  };

  #clearEventsList = () => {
    this.#eventsDict.forEach((presenter) => presenter.destroy());
    this.#eventsDict.clear();
  };

  #handleEventUpdate = (updatedEvent) => {
    this.#events = updateItemList(this.#events, updatedEvent);
    this.#defaultSortedEvents = updateItemList(this.#events, updatedEvent);
    this.#eventsDict.get(updatedEvent.id).init(updatedEvent);
  };

  #handleModeChange = () => {
    this.#eventsDict.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortEvents(sortType);
    this.#clearEventsList();
    this.#renderEventsList();
  };

  #sortEvents = (sortType) => {
    if (sortType === SortType.DEFAULT) {
      this.#events = [...this.#defaultSortedEvents];
    } else {
      this.#events = sorting[sortType](this.#events);
    }
    this.#currentSortType = sortType;
  };
}
