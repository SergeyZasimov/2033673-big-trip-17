import { filters } from '../utils/filter.js';
import FiltersView from '../view/filters-view.js';
import { remove, render } from '../framework/render.js';
import { UpdateType } from '../utils/settings.js';

export default class FiltersPresenter {
  #filtersContainer = null;
  #filtersComponent = null;
  #eventsModel = null;
  #filtersModel = null;

  constructor(filterContainer, eventsModel, filtersModel) {
    this.#filtersContainer = filterContainer;
    this.#eventsModel = eventsModel;
    this.#filtersModel = filtersModel;
  }

  get filters() {
    const events = this.#eventsModel.events;
    return Object.entries(filters).map(([name, filterEvents]) => ({
      name,
      isAvailable: Boolean(filterEvents(events).length)
    }));
  }

  init = () => {
    if (this.#filtersComponent !== null) {
      remove(this.#filtersComponent);
    }
    this.#filtersComponent = new FiltersView(this.filters, this.#filtersModel.filterType);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    render(this.#filtersComponent, this.#filtersContainer);
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filterType === filterType) {
      return;
    }
    this.#filtersModel.setFilterType(UpdateType.MAJOR, filterType);
  };
}
