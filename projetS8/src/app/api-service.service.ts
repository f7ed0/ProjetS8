import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
 


  constructor(private http: HttpClient, private userService: UserService,private authService : AuthService) {}

  getData(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/');
  }

  getDataById(id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/' + id);
  }
  
  getDataDistinct(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/distinct');
  }

  getDataDistinctUser(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/distinct/'+this.userService.getId());
  }

  getDataByUserId(userId: string): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/user/' + userId);
  }

  getDataByChatId(chatId: string): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/chat/' + chatId);
  }

  postData(chat_id: string, chat_id_user: string, chat_user: string, chat_ia: string): Observable<any> {
    const data = { chat_id, chat_id_user, chat_user, chat_ia };
    return this.http.post('http://127.0.0.1:8000/api/v1/historic/', data);
  }

  createConv(chat_id: string,chat_user:string,chat_id_user:string): Observable<any> {
    const data = { chat_id, chat_user, chat_id_user };
    return this.http.post('http://127.0.0.1:8000/api/v1/historic/new', data);

  }

  updateBotResponse(id: string, chat_ia: string): Observable<any> {
    const data = { chat_ia };
    return this.http.put('http://127.0.0.1:8000/api/v1/historic/chat/'+id , data);
  }
  getLastMessage(id: string): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/chat/unique/'+id);
  }

  connect(username :string, password :string): Observable<any> {
    const data = { username, password };
    return this.http.post('http://127.0.0.1:8000/api/v1/login/', data);
  }
  
  register(username :string, password :string): Observable<any> {
    const data = { username, password };
    return this.http.post('http://127.0.0.1:8000/api/v1/register/', data);
  }


  sendFeedback(feedback: string,chat_id: string,chat_id_user : string,chat_ia: string,id:string,is_suggestion:boolean,is_like:boolean): Observable<any> {
    const data = { feedback,chat_id,chat_id_user,chat_ia,id,is_suggestion,is_like };
    return this.http.post('http://127.0.0.1:8000/api/v1/feedback',data);
  }

  getFeedbackByChatId(id: string): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/feedback/'+id);
  }

  modifyFeedback(id: string, feedback: string,chat_id: string,chat_id_user : string,chat_ia: string,is_suggestion:boolean,is_like:boolean): Observable<any> {
    const data = { feedback,chat_id,chat_id_user,chat_ia,id,is_suggestion,is_like };
    return this.http.put('http://127.0.0.1:8000/api/v1/feedback/'+id, data);
  }

  setId(id: string) {
    this.userService.setId(id);
  }

  getId(): string { 
    return this.userService.getId();
  }

}

