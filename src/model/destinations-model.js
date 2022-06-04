export default class DestinationsModel {
  #destinations = null;
  #destinationsApiService = null;


  constructor(destinationsApiService) {
    this.#destinationsApiService = destinationsApiService;
  }

  init = async () => {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }
  };

  get destinations() {
    return this.#destinations;
  }
}
