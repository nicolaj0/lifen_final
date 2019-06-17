import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Histo } from '../model/histo';


@Injectable({
  providedIn: 'root'
})
export class FhirService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
  };

  postFile(file: String|ArrayBuffer) : Observable<string>{
    return this.http.post('https://fhirtest.uhn.ca/baseDstu3/Binary',file,{responseType: 'text'})
      .pipe(
        catchError(this.handleError)
      );
  }

  getHiso() : Observable<Histo> {
    return this.http.get<Histo>('http://hapi.fhir.org/baseDstu3/Binary/_history?_count=1&_pretty=true')
      .pipe(
        catchError(this.handleError)
      );


  }}
