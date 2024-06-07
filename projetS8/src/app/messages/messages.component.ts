import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ApiServiceService } from '../api-service.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { timeout } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  providers: [ApiServiceService]
})
export class MessagesComponent implements OnInit {
  chatId: string = '';
  messages: any = [];
  userMessage: string = '';
  botResponse: string = ''; 
  userID = this.apiService.getId();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const newChatId = params.get("chat_id");
      if (newChatId && newChatId !== this.chatId) {
        this.chatId = newChatId;
        this.getDataByChatId(this.chatId);
      }
    });
  }

  getDataByChatId(chatId: string): void {
    this.apiService.getDataByChatId(chatId).subscribe({
      next: (data: any) => {
        console.log('Data received from API:', data); // Log the received data
        this.messages = data;
        console.log(this.messages);
        console.log(this.userID);
        if (this.messages[this.messages.length - 1].chat_id_user === this.userID) {
          console.error('Network error - make sure the API server is running.');
        }
        this.cdr.detectChanges(); // Force Angular to detect changes
        this.botResponse = this.messages[this.messages.length - 1].chat_ia;
        this.checkAndUpdateLastResponse(this.chatId);
      },
      error: (error) => {
        console.error('There was an error!', error);
        if (error.status === 0) {
          console.error('Network error - make sure the API server is running.');
        } else {
          console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
        }
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }

  sendMessage(): void {
    const userMessage = this.userMessage;
    const botResponse = 'Smehli';  
    if (userMessage === '') {
      return;
    }
    this.apiService.postData(this.chatId, this.userID, userMessage, botResponse).subscribe({
      next: (data: any) => {
        this.messages.push(data);
        this.userMessage = ''; 
        this.cdr.detectChanges(); 
      },
      error: (error) => {
        console.error('There was an error saving the message!', error);
      }
    });
  }

  checkAndUpdateLastResponse(chat_id : string): void {
    this.apiService.getLastMessage(this.chatId).subscribe({
      next: (data: any) => {
        if (data.chat_ia === '') {
          this.apiService.updateBotResponse(data.id, this.botResponse).subscribe({
            next: (updatedData: any) => {
              const messageIndex = this.messages.findIndex((msg: any) => msg.id === updatedData.id);
              if (messageIndex > -1) {
                this.messages[messageIndex] = updatedData;
              }
              this.cdr.detectChanges(); // Force Angular to detect changes
            },
            error: (error) => {
              console.error('There was an error updating the message!', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('There was an error fetching the last message!', error);
      }
    });
  }
}
