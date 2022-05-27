import Observable from '../framework/observable.js';
import { FilterType } from '../utils/settings.js';

export default class FiltersModel extends Observable {
  #filterType = FilterType.EVERYTHING;

  get filterType() {
    return this.#filter;
  }

  set filterType(filter) {
    this.#filterType = filter;
  }
}
