import { remove, render, replace } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';
import {Mode} from '../utils/settings.js';

export default class EventPresenter {
  #eventComponent = null;
  #eventEditComponent = null;
  #eventsListContainer = null;

  #event = null;
  #mode = Mode.DEFAULT;

  #updateEvent = null;
  #changeMode = null;

  constructor(eventsListContainer, updateEvent, changeMode) {
    this.#eventsListContainer = eventsListContainer;
    this.#updateEvent = updateEvent;
    this.#changeMode = changeMode;
  }

  init = (event) => {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;

    this.#eventComponent = new EventView(this.#event);
    this.#eventComponent.setEditClickHandler(this.#handleEditClick);
    this.#eventComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevEventComponent === null) {
      render(this.#eventComponent, this.#eventsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    remove(prevEventComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditToEvent();
    }
  };

  destroy = () => {
    this.resetView();
    remove(this.#eventComponent);
  };

  #replaceEventToEdit = () => {
    this.#eventEditComponent = new EventEditView(this.#event);

    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#eventEditComponent.setCloseFormHandler(this.#handleCloseForm);

    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#changeMode();
    this.#mode = Mode.EDITING;

    replace(this.#eventEditComponent, this.#eventComponent);
  };

  #replaceEditToEvent = () => {
    this.#mode = Mode.DEFAULT;
    replace(this.#eventComponent, this.#eventEditComponent);
  };

  #handleEditClick = () => {
    this.#replaceEventToEdit();
  };

  #handleFormSubmit = () => {
    this.#replaceEditToEvent();
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #handleCloseForm = () => {
    this.#replaceEditToEvent();
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditToEvent();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleFavoriteClick = () => {
    this.#updateEvent({ ...this.#event, isFavorite: !this.#event.isFavorite });
  };
}
