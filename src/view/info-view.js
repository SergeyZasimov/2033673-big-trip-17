import AbstractView from '../framework/view/abstract-view.js';

const createInfoTemplate = (title, cost, dates) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${ title }</h1>

      <p class="trip-info__dates">${ dates }</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${ cost }</span>
    </p>
  </section>`
);

export default class InfoView extends AbstractView {
  #title = null;
  #cost = null;
  #dates = null;

  constructor(title, cost, dates) {
    super();
    this.#title = title;
    this.#cost = cost;
    this.#dates = dates;
  }

  get template() {
    return createInfoTemplate(this.#title, this.#cost, this.#dates);
  }
}
