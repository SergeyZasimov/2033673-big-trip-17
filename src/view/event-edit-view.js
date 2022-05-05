import { createElement } from '../render.js';
import { getEditTime } from '../utils.js';
import { offersAll } from '../mock/offer';

const createEventEditTemplate = (event = {}) => {

  const {
    type = '',
    destination = null,
    basePrice = '',
    dateFrom = '',
    dateTo = '',
    id = '',
    offers: eventOffers = [],
  } = event;

  const eventTypeOffers = (offersAll
    .find((item) => item.type === event.type)).offers;

  const eventStartTime = getEditTime(dateFrom);
  const eventEndTime = getEditTime(dateTo);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${ id }" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-${ id }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-${ id }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-${ id }">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-${ id }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
              <label class="event__type-label  event__type-label--train" for="event-type-train-${ id }">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-${ id }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-${ id }">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-${ id }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-${ id }">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-${ id }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-${ id }">Flight</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-check-in-${ id }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-${ id }">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-${ id }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-${ id }">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-${ id }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-${ id }">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${ type }
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${ id }" type="text" name="event-destination" value="${ destination.name }" list="destination-list-1">
        <datalist id="destination-list-${ id }">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${ id }" type="text" name="event-start-time" value="${ eventStartTime }">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${ id }" type="text" name="event-end-time" value="${ eventEndTime }">
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
              ${ eventOffers.includes(item.id) ? 'checked' : '' }>
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
        <p class="event__destination-description">${ destination.description }</p>
      </section>
    </section>
  </form>
    </li>`
  );
};

export default class EventEditView {
  #event = null;
  #element = null;

  constructor(event) {
    this.#event = event;
  }

  get template() {
    return createEventEditTemplate(this.#event);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
