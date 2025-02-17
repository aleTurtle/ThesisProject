import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { BotResponse } from '../models/BotResponse';


@Injectable({
  providedIn: 'root',
})
export class ChatService {

  constructor(private http: HttpClient) {}

   // Chiamata al proxy, che sarà reindirizzata a localhost:3000/api/chat

  sendMessage(userMessage: string): Observable<BotResponse> {
    const payload = { message: userMessage };
    return this.http.post<BotResponse>(environment.baseUrl+'/api/chat', payload); 
  }


  
}
