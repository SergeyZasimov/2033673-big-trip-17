import ApiService from '../framework/api-service';
import { HTTPMethods } from '../utils/settings';


export default class EventsApiService extends ApiService {

  get events() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  updateEvent = async (event) => {
    const response = await this._load({
      url: `points/${ event.id }`,
      method: HTTPMethods.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });

    return ApiService.parseResponse(response);
  };

  #adaptToServer = (event) => {
    const adaptedEvent = {
      ...event,
      ['base_price']: event.basePrice,
      ['date_to']: event.dateTo,
      ['date_from']: event.dateFrom,
      ['is_favorite']: event.isFavorite
    };

    delete adaptedEvent.basePrice;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.dateFrom;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;

  };
}
