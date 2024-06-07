import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_ID_KEY = 'user_id';
  private readonly FEEDBACK_KEY = 'false';

  constructor() {}

  setId(id: string) {
    localStorage.setItem(this.USER_ID_KEY, id);
  }

  getId(): string {
    return ""+localStorage.getItem(this.USER_ID_KEY);
  }

  setFeedback(feedback: string) {
    localStorage.setItem(this.FEEDBACK_KEY, feedback);
  }

  getFeedback(): string {
    return ""+localStorage.getItem(this.FEEDBACK_KEY);
  }

}
