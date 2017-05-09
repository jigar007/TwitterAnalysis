import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class QueryService {

  constructor(private http: Http) { }

  getNewsData() {
      return this.http.get('http://localhost:3000/stories/newsData')
          .map(res => res.json());
  }

  getHealthData() {
      return this.http.get('http://localhost:3000/stories/healthData')
          .map(res => res.json());
  }

  getShowsData() {
      return this.http.get('http://localhost:3000/stories/showsData')
          .map(res => res.json());
  }

  getMiscData() {
      return this.http.get('http://localhost:3000/stories/miscData')
          .map(res => res.json());
  }

}
