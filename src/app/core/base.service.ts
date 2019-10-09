import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService<M> {
  constructor(public httpClient: HttpClient) {}

  sendGet(url: any, useCache?: boolean): Observable<M> {
    if (useCache) {
      return this.httpClient
        .cache()
        .get(url)
        .pipe(
          map((body: any) => body),
          catchError(this.handleError)
        );
    } else {
      return this.httpClient.get(url).pipe(
        map((body: any) => body),
        catchError(this.handleError)
      );
    }
  }

  sendPost(url: any, payload: any): Observable<M> {
    return this.httpClient.post(url, payload).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  sendPatch(url: any, payload: any): Observable<M> {
    return this.httpClient.patch(url, payload).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }
  sendPut(url: any, payload: any): Observable<M> {
    return this.httpClient.put(url, payload).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  sendDelete(url: any): Observable<M> {
    return this.httpClient.delete(url).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  getFormMode() {
    return {
      CREATE: 'CREATE',
      VIEW: 'VIEW',
      UPDATE: 'UPDATE',
      DELETE: 'DELETE'
    };
  }

  baseUrl(url: string) {
    return environment.serverUrl + url;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.status === 401 || error.status === 504) {
        // this.toastr.error('Your Login had expired', 'ERROR!');
        // this.authenticationService
        //   .logout()
        //   .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
      }
    }
    // return an observable with a user-facing error message
    return throwError(JSON.stringify({ name: error.name, status: error.status, message: error.message }));
  }
}
