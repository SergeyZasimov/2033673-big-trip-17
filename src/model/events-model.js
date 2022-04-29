import { generatePoint } from '../mock/point.js';
import { getSettings } from '../settings.js';

const { TEST_EVENTS_NUMBER } = getSettings();

export default class EventsModel {
  events = Array.from({ length: TEST_EVENTS_NUMBER }, generatePoint);

  getEvents() {
    return this.events;
  }
}
