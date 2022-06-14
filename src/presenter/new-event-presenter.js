import { remove, render } from '../framework/render';
import { DEFAULT_EVENT, UpdateType, UserAction } from '../utils/settings';
import EventEditView from '../view/event-edit-view';
import OfferModel from '../model/offer-model';
import DestinationModel from '../model/destination-model';
import { getElements } from '../utils/get-elements';
import NewEventButtonView from '../view/new-event-button-view';

const { headerBoard } = getElements();

export default class NewEventPresenter {
  #newEventButtonComponent = null;
  #newEventButtonContainer = headerBoard;
  #eventEditComponent = null;
  #changeData = null;
  #createNewEventForm = null;
  #createNoEvents = null;
  #allOffers = OfferModel.offers;
  #allDestinations = DestinationModel.destinations;

  constructor(changeData, createNewEventForm, createNoEvents) {
    this.#changeData = changeData;
    this.#createNewEventForm = createNewEventForm;
    this.#createNoEvents = createNoEvents;
  }

  init = () => {
    this.#newEventButtonComponent = new NewEventButtonView();
    this.#newEventButtonComponent.setNewEventClickHandler(this.#newEventClickHandler);
    render(this.#newEventButtonComponent, this.#newEventButtonContainer);
  };

  destroy = () => {
    remove(this.#eventEditComponent);
    document.removeEventListener('click', this.#escKeyDownHandler);
    this.#newEventButtonComponent.element.removeAttribute('disabled');
  };

  setSaving = () => {
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#eventEditComponent.shake(resetFormState);
  };

  #newEventClickHandler = () => {
    this.#eventEditComponent = new EventEditView(DEFAULT_EVENT, this.#allOffers, this.#allDestinations);

    this.#eventEditComponent.setFormSubmitHandler(this.#submitClickHandler);
    this.#eventEditComponent.setCloseFormHandler(this.#resetClickHandler);
    this.#eventEditComponent.setResetHandler(this.#resetClickHandler);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#newEventButtonComponent.element.setAttribute('disabled', true);

    this.#createNewEventForm(this.#eventEditComponent);
  };

  #submitClickHandler = (event) => {
    this.#changeData(
      UserAction.ADD_EVENT,
      UpdateType.MAJOR,
      event
    );
    this.destroy();
  };

  #resetClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
