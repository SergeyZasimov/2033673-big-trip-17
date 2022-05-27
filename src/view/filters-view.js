import AbstractView from '../framework/view/abstract-view.js';

const createFiltersTemplate = (filters) => (
  `<form class="trip-filters" action="#" method="get">

    ${ filters.map(({ name, isAvailable }) => (
    `<div class="trip-filters__filter">
        <input id="filter-${ name }"
               class="trip-filters__filter-input  visually-hidden"
               type="radio"
               name="trip-filter"
               value="${ name }"
               ${ !isAvailable ? 'disabled' : '' }
               ${ name === 'everything' ? 'checked' : '' }>
          <label class="trip-filters__filter-label" for="filter-${ name }">${ name }</label>
      </div>`
  )).join('') }
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

export default class FiltersView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
