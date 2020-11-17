import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpTokenInterceptor} from './http-token-interceptor.service';


/** Http interceptor providers in outside-in order */
export const HttpInterceptorProviders = [
  // { provide: HTTP_INTERCEPTORS, useClass: HttpSpinnerInterceptor, multi: true  },
  { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
  // { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
];
