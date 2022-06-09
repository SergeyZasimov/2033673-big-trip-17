import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../utils/settings';

const NoEventTextValue = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createNoEventsTemplate = (filterType) => {
  const noEventText = NoEventTextValue[filterType];

  return `<p class="trip-events__msg">${ noEventText }</p>`;
};

export default class NoEventsView extends AbstractView {

  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoEventsTemplate(this.#filterType);
  }
}
