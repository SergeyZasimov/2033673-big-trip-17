import { render, RenderPosition } from '../render';
import InfoView from '../view/info-view';
import OffersModel from '../model/offers-model';
import { getHumanizeDay } from '../utils/date-time';
import dayjs from 'dayjs';
import { remove } from '../framework/render';


export default class InfoPresenter {
  #events = null;
  #title = null;
  #dates = null;
  #cost = null;

  #infoComponent = null;
  #infoContainer = null;
  #eventModel = null;
  #allOffers = null;

  constructor(infoContainer, eventsModel) {
    this.#infoContainer = infoContainer;
    this.#eventModel = eventsModel;
  }

  init = () => {
    if (this.#infoComponent !== null) {
      remove(this.#infoComponent);
    }

    this.#allOffers = OffersModel.offers;
    this.#events = this.#eventModel.events;
    this.#title = this.#getTitle(this.#events);
    this.#cost = this.#getCost(this.#events);
    this.#dates = this.#getDates(this.#events);
    this.#infoComponent = new InfoView(this.#title, this.#cost, this.#dates);
    render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
  };

  #getTitle = (events) => (
    events.length > 3
      ? `${ events[0].destination.name } &mdash; ... &mdash; ${ events[events.length - 1].destination.name }`
      : `${ events[0].destination.name } &mdash; ${ events[1].destination.name } &mdash; ${ events[2].destination.name }`
  );

  #getCost = (events) => (
    events.reduce((cost, event) => {
      cost += (event.basePrice + this.#getOffersCost(event));
      return cost;
    }, 0));

  #getOffersCost = (event) => {
    const offers = this.#allOffers
      .find((item) => item.type === event.type).offers
      .filter((offer) => event.offers.includes(offer.id));

    return offers.reduce((offersCost, offer) => {
      offersCost += offer.price;
      return offersCost;
    }, 0);
  };

  #getDates = (events) => {
    const beginDate = events[0].dateFrom;
    const endDate = events[events.length - 1].dateTo;


    if (dayjs(beginDate).month() === dayjs(endDate).month()) {
      return `${ getHumanizeDay(beginDate) } &mdash; ${ dayjs(endDate).date() }`;
    }

    return `${ getHumanizeDay(beginDate) } &mdash; ${ getHumanizeDay(endDate) }`;
  };
}
