import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JWTtokenService {
  private readonly USER_JWT_KEY = 'user_jwt_key';

  constructor() {}

  public setToken(token: string): void {
    localStorage.setItem(this.USER_JWT_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.USER_JWT_KEY);
  }

  public removeToken(): void {
    localStorage.removeItem(this.USER_JWT_KEY);
  }

  public getKey(): string | null {
    return this.getToken();
  }
}
