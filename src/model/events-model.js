import { generateEvent } from '../mock/event.js';
import { getTestSettings } from '../mock/testSettings';

const { TEST_EVENTS_NUMBER } = getTestSettings();

export default class EventsModel {
  #events = Array.from({ length: TEST_EVENTS_NUMBER }, generateEvent);

  get events() {
    return this.#events;
  }
}
