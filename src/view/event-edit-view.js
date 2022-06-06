import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getEditTime } from '../utils/date-time.js';
import { EVENT_TYPES } from '../utils/settings.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createEventEditTemplate = (state, allOffers, allDestinations) => {
  const { type, destination, basePrice, dateFrom, dateTo, id, offers, isNewEvent } = state;

  const typeOffers = (allOffers.find((item) => item.type === type)).offers;


  const capitalise = (word) => word.slice(0, 1).toUpperCase() + word.slice(1);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${ id }">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${ type }.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${ id }" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${ EVENT_TYPES.map((eventType) => (
      `<div class="event__type-item">
            <input id="event-type-${ eventType }-${ id }"
                   class="event__type-input  visually-hidden" type="radio" name="event-type"
                   value="${ eventType }"
                   ${ eventType === type && 'checked' }>
            <label class="event__type-label  event__type-label--${ eventType }"
                   for="event-type-${ eventType }-${ id }">${ capitalise(eventType) }</label>
          </div>`)).join('') }

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${ id }">
              ${ type }
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${ id }" type="text" name="event-destination" value="${ destination ? destination.name : '' }" list="destination-list-${ id }" autocomplete="off">
            <datalist id="destination-list-${ id }">
            ${ allDestinations.map((item) => `<option value="${ item.name }"></option>`).join('') }
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${ id }">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${ id }" type="text" name="event-start-time" value="${ getEditTime(dateFrom) }">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${ id }">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${ id }" type="text" name="event-end-time" value="${ getEditTime(dateTo) }">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${ id }">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${ id }" type="number" name="event-price" value="${ basePrice }">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${ isNewEvent ? 'Cancel' : 'Delete' }</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
        ${ typeOffers.length ?
      `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">

            ${ typeOffers.map((item) => `
              <div class="event__offer-selector">
                <input
                  class="event__offer-checkbox  visually-hidden"
                  id="event-offer-luggage-${ item.id }"
                  type="checkbox"
                  name="event-offer-luggage"
                  data-offer_id = ${ item.id }
                  ${ offers.includes(item.id) ? 'checked' : '' }>
                <label class="event__offer-label" for="event-offer-luggage-${ item.id }">
                  <span class="event__offer-title">${ item.title }</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${ item.price }</span>
                </label>
              </div>
            `).join('') }
            </div>
          </section>` : '' }
${ destination ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${ destination.description }</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">

          ${ destination.pictures.length !== 0
      ? destination.pictures.map((image) => (
        `<img class="event__photo" src="${ image.src }" alt="${ image.description }">`
      )).join('')
      : ''
    }
        </div>
      </div>
    </section> ` : '' }
        </section>
  </form>
    </li>`
  );
};

export default class EventEditView extends AbstractStatefulView {
  #datepicker = null;
  #allOffers = null;
  #allDestinations = null;

  constructor(event, allOffers, allDestinations) {
    super();
    this._state = EventEditView.convertEventToState(event);
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#setInnerHandlers();
    this.#setDatePicker();
  }

  get template() {
    return createEventEditTemplate(this._state, this.#allOffers, this.#allDestinations);
  }

  static convertEventToState = (event) => {
    const isNewEvent = !(event.destination && event.basePrice);
    return { ...event, isNewEvent };
  };

  static convertStateToTask = (state) => {
    const event = { ...state };
    delete event.isNewEvent;
    return event;
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseFormHandler(this._callback.closeForm);
    this.setResetHandler(this._callback.deleteEvent);
    this.#setDatePicker();
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setCloseFormHandler = (callback) => {
    this._callback.closeForm = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeFormHandler);
  };

  setResetHandler = (callback) => {
    this._callback.deleteEvent = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('focus', this.#focusDestinationHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestinationHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#inputPriceHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#changeOfferHandler);

  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EventEditView.convertStateToTask(this._state));
  };

  #closeFormHandler = () => {
    this._callback.closeForm();
  };

  #changeTypeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.name !== 'event-type') {
      return;
    }

    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #focusDestinationHandler = (evt) => {
    evt.preventDefault();
    evt.target.value = '';
  };

  #changeDestinationHandler = (evt) => {
    evt.preventDefault();
    const eventDestination = this.#allDestinations.find((item) => item.name === evt.target.value);
    this.updateElement({
      destination: eventDestination
    });
  };

  #inputPriceHandler = (evt) => {
    evt.preventDefault();
    this._state = { ...this._state, basePrice: evt.target.value };
  };

  #changeOfferHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    const id = +evt.target.dataset.offer_id;

    if (this._state.offers.includes(id)) {
      const index = this._state.offers.findIndex((item) => item === id);
      this._state.offers.splice(index, 1);
    } else {
      this._state.offers.push(id);
    }
  };

  #changeTimeHandler = ([dateFrom, dateTo]) => {
    this.updateElement(
      { dateFrom, dateTo }
    );
  };

  #setDatePicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('.event__field-group--time'),
      {
        mode: 'range',
        defaultDate: [this._state.dateFrom, this._state.dateTo],
        dateFormat: 'd/m/y H:S',
        enableTime: true,
        ['time_24hr']: true,
        onChange: this.#changeTimeHandler,
      }
    );
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteEvent(EventEditView.convertStateToTask(this._state));
  };
}
