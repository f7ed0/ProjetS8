import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_ID_KEY = 'user_id';
  private readonly HOME_KEY = 'false';
  private readonly CHAT_ID_KEY = '';

  constructor() {}

  setId(id: string) {
    localStorage.setItem(this.USER_ID_KEY, id);
  }

  getId(): string {
    return ""+localStorage.getItem(this.USER_ID_KEY);
  }

  setHome(home: string) {
    localStorage.setItem(this.HOME_KEY, home);
  }

  getHome(): string {
    return ""+localStorage.getItem(this.HOME_KEY);
  }

  setChatId(chatId: string) {
    localStorage.setItem(this.CHAT_ID_KEY, chatId);
  }

  getChatId(): string {
    return ""+localStorage.getItem(this.CHAT_ID_KEY);
  }

}
