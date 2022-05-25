import { offersAll } from '../mock/offer.js';
import { destinations } from '../mock/destination.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getEditTime } from '../utils/date-time.js';
import { getSettings } from '../utils/settings.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const { DEFAULT_EVENT, EVENT_TYPES } = getSettings();

const createEventEditTemplate = (state) => {

  const { type, destination, basePrice, dateFrom, dateTo, id, offers } = state;

  const eventTypeOffers = (offersAll
    .find((item) => item.type === type)).offers;

  const eventDestination = destinations.find((item) => item.name === destination);

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
            <input class="event__input  event__input--destination" id="event-destination-${ id }" type="text" name="event-destination" value="${ eventDestination.name }" list="destination-list-${ id }" autocomplete="off">
            <datalist id="destination-list-${ id }">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
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
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${ id }" type="text" name="event-price" value="${ basePrice }">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">

            ${ eventTypeOffers.map((item) => `
              <div class="event__offer-selector">
                <input
                  class="event__offer-checkbox  visually-hidden"
                  id="event-offer-luggage-${ item.id }"
                  type="checkbox"
                  name="event-offer-luggage"
                  ${ offers.includes(item.id) ? 'checked' : '' }>
                <label class="event__offer-label" for="event-offer-luggage-${ item.id }">
                  <span class="event__offer-title">${ item.title }</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${ item.price }</span>
                </label>
              </div>
            `).join('') }
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${ eventDestination.description }</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">

    ${ eventDestination.pictures.length !== 0
      ? eventDestination.pictures.map((image) => (
        `<img class="event__photo" src="${ image.src }" alt="${ image.description }">`
      )).join('')
      : ''
    }

              </div>
            </div>
          </section>
        </section>
  </form>
    </li>`
  );
};

export default class EventEditView extends AbstractStatefulView {
  #datepicker = null;

  constructor(event = DEFAULT_EVENT) {
    super();
    this._state = EventEditView.convertEventToState(event);
    this.#setInnerHandlers();
    this.#setDatePicker();
  }

  get template() {
    return createEventEditTemplate(this._state);
  }

  static convertEventToState = (event) => ({ ...event });

  static convertStateToTask = (state) => ({ ...state });

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseFormHandler(this._callback.closeForm);
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

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#changeTypeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('focus', this.#focusDestinationHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#changeDestinationHandler);

  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
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
    this.updateElement({
      destination: evt.target.value
    });
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
        // eslint-disable-next-line camelcase
        time_24hr: true,
        onChange: this.#changeTimeHandler,
      }
    );
  };
}
