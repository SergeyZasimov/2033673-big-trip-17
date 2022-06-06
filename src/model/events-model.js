import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/settings';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = [];

  constructor(eventsApiService) {
    super();
    this.#eventsApiService = eventsApiService;
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

  updateEvent = async (updateType, update) => {
    const index = this.#events.findIndex((item) => item.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    try {
      const response = await this.#eventsApiService.updateEvent(update);
      const updatedEvent = this.#adaptToClient(response);
      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1)
      ];
      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t update task');
    }
  };

  addEvent = async (updateType, update) => {
    try {
      const response = await this.#eventsApiService.addEvent(update);
      const newEvent = this.#adaptToClient(response);
      this.#events = [
        ...this.#events,
        newEvent
      ];
      this._notify(updateType, newEvent);
    } catch (err) {
      throw new Error('Can\'t add event');
    }
  };

  deleteEvent = async (updateType, update) => {
    const index = this.#events.findIndex((event) => event.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }
    try {
      await this.#eventsApiService.deleteEvent(update);
      this.#events = [
        ...this.events.slice(0, index),
        ...this.events.slice(index + 1)
      ];
      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t delete event');
    }


  };

  #adaptToClient = (event) => {
    const adaptedEvent = {
      ...event,
      basePrice: event['base_price'],
      dateFrom: event['date_from'],
      dateTo: event['date_to'],
      isFavorite: event['is_favorite']
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  };
}
