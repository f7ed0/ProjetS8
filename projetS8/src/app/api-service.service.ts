import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { JWTtokenService } from './jwttoken.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(private http: HttpClient, private userService: UserService, private jwtToken: JWTtokenService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.jwtToken.getKey();
    console.log(token);
    console.log('Bearer ' + token);
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  getData(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/', { headers: this.getAuthHeaders() });
  }

  getDataById(id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/' + id, { headers: this.getAuthHeaders() });
  }

  getDataDistinct(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/distinct', { headers: this.getAuthHeaders() });
  }

  getDataDistinctUser(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/distinct/' + this.userService.getId(), { headers: this.getAuthHeaders() });
  }

  getDataByUserId(userId: string): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/user/' + userId, { headers: this.getAuthHeaders() });
  }

  getDataByChatId(chatId: string): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/chat/' + chatId, { headers: this.getAuthHeaders() });
  }

  postData(chat_id: string, chat_id_user: string, chat_user: string, chat_ia: string): Observable<any> {
    const data = { chat_id, chat_id_user, chat_user, chat_ia };
    return this.http.post('http://127.0.0.1:8000/api/v1/historic/', data, { headers: this.getAuthHeaders() });
  }

  createConv(chat_id: string, chat_user: string, chat_id_user: string): Observable<any> {
    const data = { chat_id, chat_user, chat_id_user };
    return this.http.post('http://127.0.0.1:8000/api/v1/historic/new', data, { headers: this.getAuthHeaders() });
  }

  updateBotResponse(id: string, chat_ia: string): Observable<any> {
    const data = { chat_ia };
    return this.http.put('http://127.0.0.1:8000/api/v1/historic/chat/' + id, data, { headers: this.getAuthHeaders() });
  }

  getLastMessage(id: string): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/chat/unique/' + id, { headers: this.getAuthHeaders() });
  }

  connect(username: string, password: string): Observable<any> {
    const data = { username, password };
    return this.http.post('http://127.0.0.1:8000/api/v1/login/', data);
  }

  register(username: string, password: string): Observable<any> {
    const data = { username, password };
    return this.http.post('http://127.0.0.1:8000/api/v1/register/', data);
  }

  sendFeedback(feedback: string, chat_id: string, chat_id_user: string, chat_ia: string, id: string, is_suggestion: boolean, is_like: boolean): Observable<any> {
    const data = { feedback, chat_id, chat_id_user, chat_ia, id, is_suggestion, is_like };
    return this.http.post('http://127.0.0.1:8000/api/v1/feedback', data, { headers: this.getAuthHeaders() });
  }

  getFeedbackByChatId(id: string): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/feedback/' + id, { headers: this.getAuthHeaders() });
  }

  modifyFeedback(id: string, feedback: string, chat_id: string, chat_id_user: string, chat_ia: string, is_suggestion: boolean, is_like: boolean): Observable<any> {
    const data = { feedback, chat_id, chat_id_user, chat_ia, id, is_suggestion, is_like };
    return this.http.put('http://127.0.0.1:8000/api/v1/feedback/' + id, data, { headers: this.getAuthHeaders() });
  }

  resetAllHistoric_by_chat_id_user(chat_id_user: string): Observable<any> {
    return this.http.delete('http://127.0.0.1:8000/api/v1/historic/' + chat_id_user, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete('http://127.0.0.1:8000/api/v1/delete/' + id, { headers: this.getAuthHeaders() });
  }

  setId(id: string) {
    this.userService.setId(id);
  }

  getId(): string {
    return this.userService.getId();
  }
}
