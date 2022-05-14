import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import NoEventsView from '../view/no-events-view.js';
import { RenderPosition, render } from '../framework/render.js';
import EventPresenter from './event-presenter.js';


export default class EventsPresenter {
  #eventsContainer = null;
  #eventsModel = null;
  #events = [];
  #eventsListComponent = new EventsListView();
  #eventsDict = new Map();

  constructor(eventsContainer, eventsModel) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
  }

  init = () => {
    this.#events = [...this.#eventsModel.events];
    this.#renderEventsList();
  };

  #renderSort = () => {
    render(new SortView(), this.#eventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoEvents = () => {
    render(new NoEventsView(), this.#eventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEvent = (event) => {
    const eventPresenter = new EventPresenter(this.#eventsListComponent.element);
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
}
