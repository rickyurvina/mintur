import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Establishment } from './establishment';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
 }

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Establishment[]> {
    return this.httpClient.get<Establishment[]>(environment.url+"/establishment")
    .pipe(
      catchError(this.errorHandler)
    )
  }

  create(establishment): Observable<Establishment> {
    return this.httpClient.post<Establishment>(environment.url+"/establishment", JSON.stringify(establishment), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  find(id): Observable<Establishment> {
    return this.httpClient.get<Establishment>(environment.url+"/establishment/" + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  update(id, establishment): Observable<Establishment> {
    return this.httpClient.put<Establishment>(environment.url+"/establishment/" + id, JSON.stringify(establishment), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  destroy(id){
    return this.httpClient.delete<Establishment>(environment.url+"/establishment/" + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  showActiveEstablishment(email): Observable<Establishment> {
    return this.httpClient.get<Establishment>(environment.url+"/establishment/establishment-active/"+email)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  errorHandler(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(error);
  }
}