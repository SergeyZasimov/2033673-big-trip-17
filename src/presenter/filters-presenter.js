import { filters } from '../utils/filter';
import FiltersView from '../view/filters-view';
import { remove, render } from '../framework/render';
import { UpdateType } from '../utils/settings';
import { getElements } from '../utils/get-elements';

const { filterContainer } = getElements();

export default class FiltersPresenter {
  #filtersContainer = filterContainer;
  #filtersComponent = null;
  #eventsModel = null;
  #filtersModel = null;

  constructor(eventsModel, filtersModel) {
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
    this.#filtersModel.setFilterType(UpdateType.FILTER_MINOR, filterType);
  };
}
