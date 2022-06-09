import OffersApiService from '../api-services/offers-api-service';
import { AUTHORIZATION, END_POINT } from '../utils/settings';

export default class OfferModel {
  static #offers = null;
  static #offersApiService = new OffersApiService(END_POINT, AUTHORIZATION);

  static init = async () => {
    try {
      OfferModel.#offers = await OfferModel.#offersApiService.offers;
    } catch (err) {
      OfferModel.#offers = [];
    }
  };

  static get offers() {
    return OfferModel.#offers;
  }
}
