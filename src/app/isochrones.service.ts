import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class IsochronesService {

  constructor(private httpClient: HttpClient) { }

  getIsochrones(fromOrTo: string, fromOrToValue: string, durationsArray: number[], beginDate: Date, delay: number, iterations: number) {

    let url: string = 'https://isochrones-rest.herokuapp.com/api/isochrones?' +
        fromOrTo.toLowerCase() + '=' + fromOrToValue +
        '&beginDate=' + formatDate(beginDate, 'yyyy-MM-ddTHH:mm', 'en-US') +
        '&delay=' + delay +
        '&nb=' + iterations;

    durationsArray.forEach(duration => {
        url += '&durations=' + (duration * 60);
    });

    console.log(url);
    return this.httpClient
      .get(url);
  }

}
