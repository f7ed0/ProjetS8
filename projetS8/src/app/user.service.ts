import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_ID_KEY = 'user_id';

  constructor() {}

  setId(id: string) {
    localStorage.setItem(this.USER_ID_KEY, id);
  }

  getId(): string {
    return ""+localStorage.getItem(this.USER_ID_KEY);
  }
}
