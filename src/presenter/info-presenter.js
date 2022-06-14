import InfoView from '../view/info-view';
import OfferModel from '../model/offer-model';
import { getHumanizeDay } from '../utils/date-time';
import dayjs from 'dayjs';
import { remove, render, RenderPosition } from '../framework/render';
import { getElements } from '../utils/get-elements';

const { headerBoard } = getElements();

export default class InfoPresenter {
  #events = null;
  #title = null;
  #dates = null;
  #cost = null;

  #infoComponent = null;
  #infoContainer = headerBoard;
  #eventModel = null;
  #allOffers = null;

  constructor(eventsModel) {
    this.#eventModel = eventsModel;
  }

  init = () => {
    remove(this.#infoComponent);
    this.#allOffers = OfferModel.offers;
    this.#events = this.#eventModel.events;
    this.#title = this.#getTitle(this.#events);
    this.#cost = this.#getCost(this.#events);
    this.#dates = this.#getDates(this.#events);
    this.#infoComponent = new InfoView(this.#title, this.#cost, this.#dates);
    render(this.#infoComponent, this.#infoContainer, RenderPosition.AFTERBEGIN);
  };

  #getTitle = (events) => {
    switch (events.length) {
      case(0):
        return '';
      case(1):
        return `${ events[0].destination.name }`;
      case(2):
        return `${ events[0].destination.name } &mdash; ${ events[1].destination.name } `;
      case(3):
        return `${ events[0].destination.name } &mdash; ${ events[1].destination.name } &mdash; ${ events[2].destination.name }`;
    }
    return `${ events[0].destination.name } &mdash; ... &mdash; ${ events[events.length - 1].destination.name }`;
  };

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
    const beginDate = events[0]?.dateFrom;
    const endDate = events[events.length - 1]?.dateTo;

    if (!beginDate && !endDate) {
      return 'no date';
    }

    if (dayjs(beginDate).month() === dayjs(endDate).month()) {
      return `${ getHumanizeDay(beginDate) } &mdash; ${ dayjs(endDate).date() }`;
    }

    return `${ getHumanizeDay(beginDate) } &mdash; ${ getHumanizeDay(endDate) }`;
  };
}
