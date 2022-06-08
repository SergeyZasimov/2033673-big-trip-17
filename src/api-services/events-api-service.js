import ApiService from '../framework/api-service';
import { HTTPMethods } from '../utils/settings';
import dayjs from 'dayjs';


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

  addEvent = async (event) => {
    const response = await this._load({
      url: 'points',
      method: HTTPMethods.POST,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
    return ApiService.parseResponse(response);
  };

  deleteEvent = async (event) => (
    await this._load({
      url: `points/${ event.id }`,
      method: HTTPMethods.DELETE
    })
  );

  #adaptToServer = (event) => {
    const adaptedEvent = {
      ...event,
      ['base_price']: +event.basePrice,
      ['date_to']: dayjs(event.dateTo).toISOString(),
      ['date_from']: dayjs(event.dateFrom).toISOString(),
      ['is_favorite']: event.isFavorite
    };

    delete adaptedEvent.basePrice;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.dateFrom;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;

  };
}
