import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';
import NoEventsView from '../view/no-events-view.js';
import { RenderPosition, render } from '../framework/render';


export default class EventsPresenter {
  #eventsContainer = null;
  #eventsModel = null;
  #events = [];
  #eventsListComponent = new EventsListView();

  constructor(eventsContainer, eventsModel) {
    this.#eventsContainer = eventsContainer;
    this.#eventsModel = eventsModel;
  }

  init = () => {
    this.#events = [...this.#eventsModel.events];
    this.#renderEventsList();
  };

  #renderSort = () => {
    render(new SortView(), this.#eventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoEvents = () => {
    render(new NoEventsView(), this.#eventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEvent = (event) => {
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

      eventEditComponent.setFormSubmitHandler(() => {
        replaceEditToEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      });

      eventEditComponent.setCloseFormHandler(() => {
        replaceEditToEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      });

    };
    eventComponent.setEditClickHandler(() => replaceEventToEdit());
  };

  #renderEventsList = () => {
    if (!this.#events.length) {
      this.#renderNoEvents();
    } else {
      this.#renderSort();
      render(this.#eventsListComponent, this.#eventsContainer);

      for (let i = 0; i < this.#events.length; i++) {
        this.#renderEvent(this.#events[i]);
      }
    }
  };
}
