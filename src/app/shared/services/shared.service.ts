import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CustomError } from '../models/custom-error/custom-error.model';
import { ResponseType } from '../models/response/response.enum';
import { Response } from '../models/response/response.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  request = this.getRequest();

  constructor(private httpClient: HttpClient) { }

  private getRequest() {
    const self = this;
    return {
      get<T>(url: string, options: Object): Observable<T> {
        return self.httpClient.get<any>(url, options).pipe(
          catchError((error: { message: string }) => {
            throw new CustomError<Object>(error.message, {});
          }),
          map(responseSerialized => {
          const response = new Response<T>(responseSerialized, ResponseType.Success, null);
          return response.data;
        }));
      },
      getWithAppend<T, U>(url: string, options: Object, append: U): Observable<{ append: U, data: T }> {
        return self.httpClient.get<any>(url, options).pipe(
          catchError((error: { message: string }) => {
            throw new CustomError<U>(error.message, append);
          }),
          map(responseSerialized => {
          const response = new Response<T>(responseSerialized, ResponseType.Success, null);
          return { append: append, data: response.data }
        }));
      },
      post<T>(url: string, body: Object, options: Object): Observable<T> {
        return self.httpClient.post<any>(url, body, options).pipe(
          catchError((error: { message: string }) => {
            throw new CustomError<Object>(error.message, {});
          }),
          map(responseSerialized => {
          const response = new Response<T>(responseSerialized, ResponseType.Success, null);
          return response.data;
        }));
      },
    };
  }
}
