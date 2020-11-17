import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {concat, Observable, of, throwError} from 'rxjs';
import {catchError, concatMap, map, switchMap, take} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {


  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let retries = 0;
    return this.authService.tokenObservable$.pipe(
      take(1),
      map(token => req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })),
      concatMap(authReq => next.handle(authReq)),
      // Catch the 401 and handle it by refreshing the token and restarting the chain
      // (where a new subscription to this.auth.token will get the latest token).
      switchMap((res: any) => {
        // TODO format the error response on Apollo server
        if (res.body?.errors && res.body.errors[0].message === 'Unauthorized') {
          return throwError('Unauthorized');
        }
        return of(res);
      }),
      catchError((err, restart) => {
        // If the request is unauthorized, try refreshing the token before restarting.
        if (err === 'Unauthorized' && retries === 0) {
          retries++;

          return concat(this.authService.refreshToken(), restart);
        }
        if (retries > 0) {
          this.userService.logout();
        }
        return throwError(err);
      })
    );
  }

}
