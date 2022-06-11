import Observable from '../framework/observable';
import { FilterType } from '../utils/settings';

export default class FilterModel extends Observable {
  #filterType = FilterType.EVERYTHING;

  get filterType() {
    return this.#filterType;
  }

  setFilterType(updateType, filter) {
    this.#filterType = filter;
    this._notify(updateType, filter);
  }
}
