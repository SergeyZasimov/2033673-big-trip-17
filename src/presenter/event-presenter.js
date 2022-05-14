import { render, replace } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';


export default class EventPresenter {
  #eventComponent = null;
  #eventEditComponent = null;
  #eventsListContainer = null;
  #event = null;

  constructor(eventsListContainer) {
    this.#eventsListContainer = eventsListContainer;
  }

  init = (event) => {
    this.#event = event;
    this.#eventComponent = new EventView(this.#event);
    this.#eventComponent.setEditClickHandler(this.#handleEditClick);
    render(this.#eventComponent, this.#eventsListContainer);
  };

  #replaceEventToEdit = () => {
    this.#eventEditComponent = new EventEditView(this.#event);

    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#eventEditComponent.setCloseFormHandler(this.#handleCloseForm);

    document.addEventListener('keydown', this.#onEscKeyDown);

    replace(this.#eventEditComponent, this.#eventComponent);
  };

  #replaceEditToEvent = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
  };

  #handleEditClick = () => {
    this.#replaceEventToEdit();
  };

  #handleFormSubmit = () => {
    this.#replaceEditToEvent();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #handleCloseForm = () => {
    this.#replaceEditToEvent();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditToEvent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}
