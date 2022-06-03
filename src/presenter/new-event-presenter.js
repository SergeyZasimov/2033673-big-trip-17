import { remove, render, RenderPosition } from '../framework/render';
import { UpdateType, UserAction } from '../utils/settings';
import { nanoid } from 'nanoid';
import EventEditView from '../view/event-edit-view';

export default class NewEventPresenter {
  #eventListComponent = null;
  #newEventButtonComponent = null;
  #eventEditComponent = null;
  #changeData = null;
  #changeMode = null;
  #rerenderSort = null;
  #rerenderFilters = null;
  #filterModel = null;

  constructor(eventListComponent, newEventButtonComponent, filterModel, changeData, changeMode, rerenderSort, rerenderFilters) {
    this.#eventListComponent = eventListComponent;
    this.#newEventButtonComponent = newEventButtonComponent;
    this.#filterModel = filterModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#rerenderSort = rerenderSort;
    this.#rerenderFilters = rerenderFilters;
  }

  init = () => {
    this.#newEventButtonComponent.setNewEventClickHandler(this.#handleNewEventClick);
    document.addEventListener('keydown', this.#onEscKeydownHandler);
  };

  destroy = () => {
    if (this.#eventEditComponent === null) {
      return;
    }
    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    this.#newEventButtonComponent.element.removeAttribute('disabled');
    document.removeEventListener('click', this.#onEscKeydownHandler);
  };

  #handleNewEventClick = () => {
    this.#eventEditComponent = new EventEditView();
    this.#eventEditComponent.setFormSubmitHandler(this.#handleSubmitClick);
    this.#eventEditComponent.setCloseFormHandler(this.#handleResetClick);
    this.#eventEditComponent.setResetHandler(this.#handleResetClick);

    this.#newEventButtonComponent.element.setAttribute('disabled', true);
    this.#changeMode();
    this.#rerenderSort();
    this.#rerenderFilters();
    render(this.#eventEditComponent, this.#eventListComponent, RenderPosition.AFTERBEGIN);

  };

  #handleSubmitClick = (event) => {
    this.#changeData(
      UserAction.ADD_EVENT,
      UpdateType.MAJOR,
      { id: nanoid(), ...event }
    );
    this.destroy();
  };

  #handleResetClick = () => {
    this.destroy();
  };

  #onEscKeydownHandler = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }

  };
}
