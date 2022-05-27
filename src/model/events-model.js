import { generateEvent } from '../mock/event.js';
import { getTestSettings } from '../mock/testSettings';
import Observable from '../framework/observable.js';

const { TEST_EVENTS_NUMBER } = getTestSettings();

export default class EventsModel extends Observable {
  #events = Array.from({ length: TEST_EVENTS_NUMBER }, generateEvent);

  get events() {
    return this.#events;
  }

  updateEvent = (updatedItem) => {
    const index = this.#events.findIndex((item) => item.id === updatedItem.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    return [
      ...this.#events.slice(0, index),
      updatedItem,
      ...this.#events.slice(index + 1)
    ];
  };
}
