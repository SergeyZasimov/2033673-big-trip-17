import { generateEvent } from '../mock/event.js';
import { getTestSettings } from '../mock/testSettings';
import Observable from '../framework/observable.js';

const { TEST_EVENTS_NUMBER } = getTestSettings();

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = Array.from({ length: TEST_EVENTS_NUMBER }, generateEvent);

  constructor(eventsApiService) {
    super();
    this.#eventsApiService = eventsApiService;

    this.#eventsApiService.events
      .then((events) => console.log(events))
  }


  get events() {
    return this.#events;
  }

  updateEvent = (updateType, update) => {
    const index = this.#events.findIndex((item) => item.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1)
    ];

    this._notify(updateType, update);
  };

  addEvent = (updateType, update) => {
    this.#events = [
      ...this.#events,
      update
    ];

    this._notify(updateType, update);
  };

  deleteEvent = (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this.#events = [
      ...this.events.slice(0, index),
      ...this.events.slice(index + 1)
    ];

    this._notify(updateType, update);
  };
}
