import { render, RenderPosition } from '../render';
import InfoView from '../view/info-view';


export default class InfoPresenter {
  #title = null;
  #dates = null;
  #cost = null;

  #infoComponent = null;
  #infoContainer = null;
  #eventModel = null;

  constructor(infoContainer, eventsModel) {
    this.#infoContainer = infoContainer;
    this.#eventModel = eventsModel;
  }

  init = () => {
    this.#title = this.#getTitle()
    this.#infoComponent = new InfoView(this.#title);
    render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
  };

  #getTitle = () => {
    const events = this.#eventModel.events;
    return events.length > 3
      ? `${ events[0].destination.name } &mdash; ... &mdash; ${ events[events.length - 1].destination.name }`
      : `${ events[0].destination.name } &mdash; ${ events[1].destination.name } &mdash; ${ events[2].destination.name }`;
  };
}
