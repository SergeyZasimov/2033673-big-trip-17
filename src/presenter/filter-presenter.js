import { filters } from '../utils/filter.js';
import FiltersView from '../view/filters-view';
import { render } from '../framework/render';

export default class FilterPresenter {
  #filtersContainer = null;
  #filtersComponent = null;
  #eventsModel = null;

  constructor(filterContainer, eventsModel) {
    this.#filtersContainer = filterContainer;
    this.#eventsModel = eventsModel;
  }

  get filters() {
    const events = this.#eventsModel.events;
    return Object.entries(filters).map(([name, filterIsAvailable]) => ({
      name,
      isAvailable: filterIsAvailable(events)
    }));
  }

  init = () => {
    this.#filtersComponent = new FiltersView(this.filters);
    render(this.#filtersComponent, this.#filtersContainer);
  };
}
