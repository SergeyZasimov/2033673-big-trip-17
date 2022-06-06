import OffersApiService from '../api-services/offers-api-service';
import { AUTHORIZATION, END_POINT } from '../utils/settings';

export default class OffersModel {
  static #offers = null;
  static #offersApiService = new OffersApiService(END_POINT, AUTHORIZATION);

  static init = async () => {
    try {
      OffersModel.#offers = await OffersModel.#offersApiService.offers;
    } catch (err) {
      OffersModel.#offers = [];
    }
  };

  static get offers() {
    return OffersModel.#offers;
  }
}
