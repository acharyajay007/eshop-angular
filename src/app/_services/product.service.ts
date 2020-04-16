import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Product } from '@app/_models';
import { map } from 'rxjs/operators';
import {plainToClass} from 'class-transformer';

@Injectable({ providedIn: 'root' })
export class ProductService {
    constructor(private http: HttpClient) { }

    getAll(object) {
        return this.http.post<any>(`${environment.apiUrl}/product`, object)
        .pipe(
          map(response => {
          return response.data;
      }));
    }
    getAllCategory() {
      return this.http.get<any>(`${environment.apiUrl}/category`)
      .pipe(
        map(response => {
        return response.data;
    }));
  }
    get(object) {
      return this.http.get<any>(environment.apiUrl + '/product/' + object)
      .pipe(
        map(response => {
        return response.data;
    }));
  }
    delete(object) {
        return this.http.delete<any>(environment.apiUrl + '/product/' + object)
        .pipe(
          map(response => {
          return response.data;
      }));
    }
    add(object) {
        return this.http.post<any>(`${environment.apiUrl}/product/add`, object)
        .pipe(
          map(response => {
          return response.data;
      }));
    }
    update(id, object) {
      return this.http.put<any>(environment.apiUrl + '/product/' + id, object)
      .pipe(
        map(response => {
        return response.data;
    }));
  }
}
