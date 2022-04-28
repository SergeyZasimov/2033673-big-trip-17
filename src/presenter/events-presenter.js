import { render } from '../render.js';

import EventsListView from '../views/events-list-view.js';
import SortView from '../views/sort-view.js';
import EventView from '../views/event-view.js';
import EventItemView from '../views/event-list-item.js';
import EventEditView from '../views/event-edit-view.js';


const eventsNumber = 3;

export default class EventsPresenter {
  eventsListComponent = new EventsListView();

  init(eventsContainer) {
    this.eventsContainer = eventsContainer;

    render(new SortView(), this.eventsContainer);
    render(this.eventsListComponent, this.eventsContainer);

    this.createEvent(new EventEditView());

    for (let i = 0; i < eventsNumber; i++) {
      this.createEvent(new EventView());
    }
  }

  createEvent(component) {
    const listItem = new EventItemView();
    render(listItem, this.eventsListComponent.getElement());
    render(component, listItem.getElement());
  }
}
