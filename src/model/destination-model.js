import DestinationsApiService from '../api-services/destinations-api-service';
import { AUTHORIZATION, END_POINT } from '../utils/settings';

export default class DestinationModel {
  static #destinations = null;
  static #destinationsApiService = new DestinationsApiService(END_POINT, AUTHORIZATION);

  static init = async () => {
    try {
      DestinationModel.#destinations = await DestinationModel.#destinationsApiService.destinations;
    } catch (err) {
      DestinationModel.#destinations = [];
    }
  };

  static get destinations() {
    return DestinationModel.#destinations;
  }
}
