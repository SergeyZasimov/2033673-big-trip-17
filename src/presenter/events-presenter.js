import { render } from '../render.js';

import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';
import NoEventsView from '../view/no-events-view.js';


export default class EventsPresenter {
  #eventsListComponent = null;

  init(eventsContainer, eventsModel) {
    this.#eventsListComponent = new EventsListView();
    this.eventsContainer = eventsContainer;
    this.eventsModel = eventsModel;
    this.events = [...this.eventsModel.events];

    if (!this.events.length) {
      render(new NoEventsView(), this.eventsContainer);
    } else {
      render(new SortView(), this.eventsContainer);
      render(this.#eventsListComponent, this.eventsContainer);

      for (let i = 0; i < this.events.length; i++) {
        this.#renderEvent(this.events[i]);
      }
    }
  }

  #renderEvent(event) {
    const eventComponent = new EventView(event);
    render(eventComponent, this.#eventsListComponent.element);

    const replaceEventToEdit = () => {
      const eventEditComponent = new EventEditView(event);
      this.#eventsListComponent.element.replaceChild(eventEditComponent.element, eventComponent.element);

      const replaceEditToEvent = () => {
        this.#eventsListComponent.element.replaceChild(eventComponent.element, eventEditComponent.element);
      };

      const onEscKeyDown = (evt) => {
        if (evt.key === 'Esc' || evt.key === 'Escape') {
          evt.preventDefault();
          replaceEditToEvent();
          document.removeEventListener('keydown', onEscKeyDown);
        }
      };

      document.addEventListener('keydown', onEscKeyDown);

      eventEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
        evt.preventDefault();
        replaceEditToEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      });

      eventEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
        replaceEditToEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      });

    };
    eventComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceEventToEdit();
    });
  }
}
