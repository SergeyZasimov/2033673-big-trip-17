import { render } from '../render.js';

import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import EventView from '../view/event-view.js';
import EventItemView from '../view/event-list-item.js';
import EventEditView from '../view/event-edit-view.js';


export default class EventsPresenter {
  #eventsListComponent = null;

  init(eventsContainer, eventsModel) {
    this.#eventsListComponent = new EventsListView();
    this.eventsContainer = eventsContainer;
    this.eventsModel = eventsModel;
    this.events = [...this.eventsModel.events];

    render(new SortView(), this.eventsContainer);
    render(this.#eventsListComponent, this.eventsContainer);

    this.createEvent(new EventEditView(this.events[0]));

    for (let i = 0; i < this.events.length; i++) {
      this.createEvent(new EventView(this.events[i]));
    }
  }

  createEvent(content) {
    const listItem = new EventItemView();
    render(listItem, this.#eventsListComponent.element);
    render(content, listItem.element);
  }
}
