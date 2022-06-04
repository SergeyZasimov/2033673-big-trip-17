import { generateEvent } from '../mock/event.js';
import { getTestSettings } from '../mock/testSettings';
import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/settings';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = [];

  constructor(eventsApiService) {
    super();
    this.#eventsApiService = eventsApiService;

    this.#eventsApiService.events
      .then((events) => console.log(events.map(this.#adaptToClient)));
  }

  init = async () => {
    try {
      const events = await this.#eventsApiService.events;
      this.#events = events.map(this.#adaptToClient);
    } catch (err) {
      this.#events = [];
    }

    this._notify(UpdateType.INIT);
  };


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

  #adaptToClient = (event) => {
    const adaptedEvent = {
      ...event,
      basePrice: event.base_price,
      dateFrom: event['date_from'],
      dateTo: event['date_to'],
      isFavorite: event['is_favorite']
    };

    delete adaptedEvent.base_price;
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  };
}
