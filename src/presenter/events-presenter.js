import { render } from '../render.js';

import EventsListView from '../views/events-list-view.js';
import SortView from '../views/sort-view';


export default class EventsPresenter {
  eventsListComponent = new EventsListView();

  init(eventsContainer) {
    this.eventsContainer = eventsContainer;

    render(new SortView(), this.eventsContainer);
    render(this.eventsListComponent.getElement(), this.eventsContainer);
  }

}
