import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    console.log(this.http.get('http://127.0.0.1:8000/api/v1/historic/'));
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/');
  }

  getDataById(id: number): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/' + id);
  }
  
  getDataDistinct(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/distinct');
  }

  getDataByChatId(chatId: string): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/chat/' + chatId);
  }

  postData(chat_id: string, chat_user: string, chat_ia: string): Observable<any> {
    const data = { chat_id, chat_user, chat_ia };
    console.log(data);
    return this.http.post('http://127.0.0.1:8000/api/v1/historic/', data);
  }

  updateBotResponse(id: string, chat_ia: string): Observable<any> {
    const data = { chat_ia };
    return this.http.put('http://127.0.0.1:8000/api/v1/historic/chat/'+id , data);
  }
  getLastMessage(id: string): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/v1/historic/chat/unique/'+id);
  }

}
