import AbstractView from '../framework/view/abstract-view';

const createNewEventButtonTemplate = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
);

export default class NewEventButtonView extends AbstractView {

  get template() {
    return createNewEventButtonTemplate();
  }

  setNewEventClickHandler = (callback) => {
    this._callback.newEventClick = callback;
    this.element.addEventListener('click', this.#handleNewEventClick);
  };

  #handleNewEventClick = (evt) => {
    evt.preventDefault();
    this._callback.newEventClick();
  };
}
