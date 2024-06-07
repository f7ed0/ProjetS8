import { Component, OnInit, Inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ApiServiceService } from '../api-service.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  chatId: string = '';
  messages: any[] = [];
  userMessage: string = '';
  botResponse: string = ''; 
  userID = this.apiService.getId();

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const newChatId = params.get("chat_id");
      if (newChatId && newChatId !== this.chatId) {
        this.chatId = newChatId;
        this.getDataByChatId(this.chatId);
      }
    });
  }

  scrollToBottom(): void {
    let container = document.querySelector("#app-messages");
    let value = container?.scrollHeight;
    console.log(container);
    if(container != null) {
      container.scrollTo({
        top: value,
        behavior: 'smooth'
      });
    }
  }

  getDataByChatId(chatId: string): void {
    this.apiService.getDataByChatId(chatId).subscribe({
      next: (data: any) => {
        this.messages = data;
        if (this.messages[this.messages.length - 1].chat_id_user === this.userID) {
          console.error('Network error - make sure the API server is running.');
        }
        this.cdr.detectChanges();
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
        this.scrollToBottom();
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

  copyToClipboard(botResponse : string, index : string): void {
    navigator.clipboard.writeText(botResponse).then(() => {
      this.checkAction(index);
      console.log('Bot response copied to clipboard');
    }, (err) => {
      console.error('Failed to copy bot response to clipboard', err);
    });
  }

  likeResponse(botResponse : string, index : string): void {
    this.checkAction(index);
     // Send the like to the Database
  }

  dislikeResponse(botResponse : string, index : string): void {
    this.openDialog(botResponse, index);
  }

  checkAction(id : string, classname : string = 'greenColor'){
    document.getElementById(id)?.classList.add(classname);
    this.cdr.detectChanges();
    setTimeout(() => {
      document.getElementById(id)?.classList.remove(classname);
      this.cdr.detectChanges();
    }, 1500);
  }



  openDialog(botResponse : string, index : string) {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      width: '90%',
      maxWidth: '500px',
      data: { botResponse: botResponse }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.buttonClicked == "send") {
        this.checkAction(index, 'redColor');
        // Send the dislike to the Database
      }
     
    });
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dislike.component.html',
  styleUrls: ['dislike.component.scss'],
  standalone: true,
  imports: [MatIconModule, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, FormsModule ],
})
export class DialogContentExampleDialog {
  textContent: string = '';
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { botResponse: string }
  ) {}

  onCloseWithResult(result: string): void {
    this.dialogRef.close({ buttonClicked: result, textareaContent: this.textContent });
  }
}