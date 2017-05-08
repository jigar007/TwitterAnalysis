import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class QueryService {

  constructor(private http: Http) { }

  sampleJson() {
      return this.http.get('http://localhost:3000/stories/health')
          .map(res => res.json());
  }

}
