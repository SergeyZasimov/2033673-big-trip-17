import ApiService from '../framework/api-service';


export default class EventsApiService extends ApiService {

  get events() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }
}
