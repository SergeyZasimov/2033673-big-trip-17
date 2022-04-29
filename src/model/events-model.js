import { generatePoint } from '../mock/point.js';

export default class EventsModel {
  events = Array.from({ length: 4 }, generatePoint);

  getEvents() {
    return this.events;
  }
}
