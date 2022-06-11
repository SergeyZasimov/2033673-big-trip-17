import Observable from '../framework/observable';
import { SortType } from '../utils/settings';

export default class SortModel extends Observable {
  #sortType = SortType.DEFAULT;

  get sortType() {
    return this.#sortType;
  }

  setSortType = (updateType, sortType) => {
    this.#sortType = sortType;
    this._notify(updateType, sortType);
  };
}
