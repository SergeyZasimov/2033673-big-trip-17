import { createElement } from '../render.js';
import { offersAll } from '../mock/offer.js';
import { getDuration, getHumanizeDay, getHumanizeTime, getMarkupDate, getMarkupTime } from '../utils';

const createEventTemplate = (event) => {
  const { type, destination, basePrice, isFavorite, dateFrom, dateTo } = event;

  const eventTypeOffers = (offersAll
    .find((item) => item.type === event.type)).offers
    .filter((item) => event.offers.includes(item.id));

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  const eventDate = getHumanizeDay(dateFrom);
  const eventStartTime = getHumanizeTime(dateFrom);
  const eventEndTime = getHumanizeTime(dateTo);
  const markupDate = getMarkupDate(dateFrom);
  const markupStartTime = getMarkupTime(dateFrom);
  const markupEndTime = getMarkupTime(dateTo);
  const duration = getDuration(dateFrom, dateTo);

  return (
    `<div class="event">
      <time class="event__date" datetime=${ markupDate }>${ eventDate }</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${ type } ${ destination.name }</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime=${ markupStartTime }>${ eventStartTime }</time>
          &mdash;
          <time class="event__end-time" datetime=${ markupEndTime }>${ eventEndTime }</time>
        </p>
        <p class="event__duration">${ duration }</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${ basePrice }</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      ${ event.offers ? `
      <ul class="event__selected-offers">
        ${ eventTypeOffers.map(({ title, price }) => `
        <li class="event__offer">
          <span class="event__offer-title">${ title }</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${ price }</span>
        </li>
        `).join('') }
      </ul>
      ` : '' }
      <button class="${ favoriteClassName }" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
  </div>`
  );
};

export default class EventView {
  constructor(event) {
    this.event = event;
  }

  getTemplate() {
    return createEventTemplate(this.event);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
