import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from './token.service'; // Assuming you have a TokenService

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.tokenService.getAuthorizationToken();
    const authReq = request.clone({
      setHeaders: {
        'X-Auth-Token': authToken
      }
    });
    
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          console.log(error.message);
        } else {
          this.tokenService.sessionExpire.emit('sessionExpired');
        }
        console.log('error Code', error);
        return throwError(error);
      }),
      map((event: HttpEvent<any>) => {
        return event;
      })
    );
  }
}
