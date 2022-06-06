import { remove, render, RenderPosition } from '../framework/render';
import { DEFAULT_EVENT, UpdateType, UserAction } from '../utils/settings';
import EventEditView from '../view/event-edit-view';
import OffersModel from '../model/offers-model';
import DestinationsModel from '../model/destinations-model';

export default class NewEventPresenter {
  #eventListComponent = null;
  #eventEditComponent = null;
  #changeData = null;
  #allOffers = OffersModel.offers;
  #allDestinations = DestinationsModel.destinations;
  #handleNewEventFormClose = null;

  constructor(eventListComponent, changeData, handleNewEventFormClose) {
    this.#eventListComponent = eventListComponent;
    this.#changeData = changeData;
    this.#handleNewEventFormClose = handleNewEventFormClose;
  }

  init = () => {
    this.#handleNewEventClick();
    document.addEventListener('keydown', this.#onEscKeydownHandler);
  };

  destroy = () => {
    remove(this.#eventEditComponent);
    document.removeEventListener('click', this.#onEscKeydownHandler);
    this.#handleNewEventFormClose();
  };

  resetView = () => this.destroy();

  #handleNewEventClick = () => {
    this.#eventEditComponent = new EventEditView(DEFAULT_EVENT, this.#allOffers, this.#allDestinations);
    this.#eventEditComponent.setFormSubmitHandler(this.#handleSubmitClick);
    this.#eventEditComponent.setCloseFormHandler(this.#handleResetClick);
    this.#eventEditComponent.setResetHandler(this.#handleResetClick);
    render(this.#eventEditComponent, this.#eventListComponent, RenderPosition.AFTERBEGIN);

  };

  #handleSubmitClick = (event) => {
    this.#changeData(
      UserAction.ADD_EVENT,
      UpdateType.MAJOR,
      event
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
