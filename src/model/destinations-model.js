import DestinationsApiService from '../api-services/destinations-api-service';
import { AUTHORIZATION, END_POINT } from '../utils/settings';

export default class DestinationsModel {
  static #destinations = null;
  static #destinationsApiService = new DestinationsApiService(END_POINT, AUTHORIZATION);


  static init = async () => {
    try {
      DestinationsModel.#destinations = await DestinationsModel.#destinationsApiService.destinations;
    } catch (err) {
      DestinationsModel.#destinations = [];
    }
  };

  static get destinations() {
    return DestinationsModel.#destinations;
  }
}
