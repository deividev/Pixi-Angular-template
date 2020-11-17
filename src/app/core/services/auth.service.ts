import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';

const LOCALSTORAGE_TOKEN_KEY = 'accessToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _token$ = new BehaviorSubject<string>(null);
  tokenObservable$ = this._token$.asObservable();

  constructor() { }


  refreshToken(): Observable<any> {
    return of();
  }

  logout() {
    this.token = null;
  }

  set token(value) {
    this._token$.next(value);
    if (value) {
      localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, value);
    } else {
      localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
    }
  }

}
