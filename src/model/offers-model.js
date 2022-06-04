export default class OffersModel {
  #offers = null;
  #offersApiService = null;

  constructor(offersApiService) {
    this.#offersApiService = offersApiService;
  }

  init = async () => {
    try {
      this.#offers = await this.#offersApiService.offers;
    } catch (err) {
      this.#offers = [];
    }
  };

  get offers() {
    return this.#offers;
  }
}
