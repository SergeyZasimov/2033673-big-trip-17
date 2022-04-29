import { render } from '../render.js';

import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import EventView from '../view/event-view.js';
import EventItemView from '../view/event-list-item.js';
import EventEditView from '../view/event-edit-view.js';


export default class EventsPresenter {
  eventsListComponent = new EventsListView();

  init(eventsContainer, eventsModel) {
    this.eventsContainer = eventsContainer;
    this.eventsModel = eventsModel;
    this.events = [...this.eventsModel.getEvents()];

    render(new SortView(), this.eventsContainer);
    render(this.eventsListComponent, this.eventsContainer);

    this.createEvent(new EventEditView());

    for (let i = 0; i < this.events.length; i++) {
      this.createEvent(new EventView());
    }
  }

  createEvent(content) {
    const listItem = new EventItemView();
    render(listItem, this.eventsListComponent.getElement());
    render(content, listItem.getElement());
  }
}
