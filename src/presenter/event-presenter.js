import { remove, render, replace } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';
import { Mode, UpdateType, UserAction } from '../utils/settings.js';
import OffersModel from '../model/offers-model';
import DestinationsModel from '../model/destinations-model';

export default class EventPresenter {
  #eventComponent = null;
  #eventEditComponent = null;
  #eventsListContainer = null;

  #event = null;
  #mode = Mode.DEFAULT;
  #allOffers = OffersModel.offers;
  #allDestinations = DestinationsModel.destinations;
  #changeData = null;
  #changeMode = null;

  constructor(eventsListContainer, changeData, changeMode) {
    this.#eventsListContainer = eventsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (event) => {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    this.#eventComponent = new EventView(this.#event, this.#allOffers);
    this.#eventComponent.setEditClickHandler(this.#handleEditClick);
    this.#eventComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevEventComponent === null) {
      render(this.#eventComponent, this.#eventsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      this.#replaceEditToEvent();
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

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  };

  #replaceEventToEdit = () => {
    this.#eventEditComponent = new EventEditView(this.#event, this.#allOffers, this.#allDestinations);

    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#eventEditComponent.setCloseFormHandler(this.#handleCloseForm);
    this.#eventEditComponent.setResetHandler(this.#handleDeleteClick);

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

  #handleFormSubmit = (event) => {
    // this.#replaceEditToEvent();
    // this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      event
    );
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
    this.#changeData(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      { ...this.#event, isFavorite: !this.#event.isFavorite });
  };

  #handleDeleteClick = (event) => {
    this.#changeData(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event
    );
  };
}
