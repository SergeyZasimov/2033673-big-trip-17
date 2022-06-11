import { remove, render } from '../framework/render';
import SortView from '../view/sort-view';
import { getElements } from '../utils/get-elements';
import { UpdateType } from '../utils/settings';

const { mainBoard } = getElements();


export default class SortPresenter {
  #mainBoard = mainBoard;
  #sortComponent = null;
  #sortModel = null;

  constructor(sortModel) {
    this.#sortModel = sortModel;
  }

  init = () => {
    remove(this.#sortComponent);
    this.#sortComponent = new SortView(this.#sortModel.sortType);
    render(this.#sortComponent, this.#mainBoard);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  removeSortComponent = () => remove(this.#sortComponent);

  #handleSortTypeChange = (sortType) => {
    if (this.#sortModel.sortType === sortType) {
      return;
    }
    this.#sortModel.setSortType(UpdateType.MINOR, sortType);
  };
}
