import { remove, render, RenderPosition } from '../framework/render';
import { DEFAULT_EVENT, FilterType, UpdateType, UserAction } from '../utils/settings';
import EventEditView from '../view/event-edit-view';
import OffersModel from '../model/offers-model';
import DestinationsModel from '../model/destinations-model';
import { getElements } from '../utils/get-elements';
import NewEventButtonView from '../view/new-event-button-view';

const { headerBoard } = getElements();

export default class NewEventPresenter {
  #newEventButtonComponent = null;
  #newEventButtonContainer = headerBoard;
  #eventListComponent = null;
  #eventEditComponent = null;
  #filtersModel = null;
  #changeData = null;
  #allOffers = OffersModel.offers;
  #allDestinations = DestinationsModel.destinations;

  constructor(eventListComponent, changeData, filterModel) {
    this.#eventListComponent = eventListComponent;
    this.#changeData = changeData;
    this.#filtersModel = filterModel;
  }

  init = () => {
    this.#newEventButtonComponent = new NewEventButtonView();
    this.#newEventButtonComponent.setNewEventClickHandler(this.#handleNewEventClick);
    render(this.#newEventButtonComponent, this.#newEventButtonContainer);
  };

  destroy = () => {
    remove(this.#eventEditComponent);
    document.removeEventListener('click', this.#onEscKeydownHandler);
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

  #handleNewEventClick = () => {
    this.#eventEditComponent = new EventEditView(DEFAULT_EVENT, this.#allOffers, this.#allDestinations);

    this.#eventEditComponent.setFormSubmitHandler(this.#handleSubmitClick);
    this.#eventEditComponent.setCloseFormHandler(this.#handleResetClick);
    this.#eventEditComponent.setResetHandler(this.#handleResetClick);

    render(this.#eventEditComponent, this.#eventListComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeydownHandler);

    this.#newEventButtonComponent.element.setAttribute('disabled', true);

    this.#filtersModel.setFilterType(UpdateType.FILTER_MINOR, FilterType.EVERYTHING);
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
