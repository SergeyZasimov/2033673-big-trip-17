import { generateEvent } from '../mock/event.js';
import { getSettings } from '../settings.js';

const { TEST_EVENTS_NUMBER } = getSettings();

export default class EventsModel {
  events = Array.from({ length: TEST_EVENTS_NUMBER }, generateEvent);

  getEvents() {
    return this.events;
  }
}
