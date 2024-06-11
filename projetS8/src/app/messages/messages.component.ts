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
import {MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  chatId: string = '';
  isSending = false;
  messages: any[] = [];
  userMessage: string = '';
  botResponse: string = ''; 
  userID = this.apiService.getId();
  message_id = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
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
        console.log(this.messages);
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
    const botResponse = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus esse in blanditiis perspiciatis mollitia. '+
    "Cupiditate delectus, minus fugit similique molestias adipisci placeat, officiis laborum dolores impedit eos est vitae iusto. Alias voluptate fugiat ad aliquam ipsa, quasi doloremque exercitationem vitae deleniti, ducimus nam? Labore fugiat, cupiditate libero ipsam nam magni deleniti ratione et? Ab odit molestiae explicabo officiis assumenda eveniet.";  
    if (userMessage === '') {
      return;
    }

    this.apiService.postData(this.chatId, this.userID, userMessage, botResponse).subscribe({
      next: (data: any) => {
        this.loadIcon();
        setTimeout(() => {
          this.messages.push(data);
          this.userMessage = ''; 
          this.cdr.detectChanges(); 
          this.scrollToBottom();
        }, 3000);
      },
      error: (error) => {
        console.error('There was an error saving the message!', error);
      }
    });
  }

  decomposerEnMots(phrase: string): string[] {
    return phrase.split(' ');
  }

  detectSkip(mot : string){
    return mot.replace(/\n/g, '<br>');
  }

  isAnimated(timestamp: string, thresold: number): boolean {
    const dateTimestamp = new Date(timestamp).getTime();
    const dateActuelle = new Date().getTime();
    const diffEnMillisecondes = dateActuelle - dateTimestamp;
    const time = 1000*thresold;
    return diffEnMillisecondes <= time;
  }

  loadIcon(){
    this.isSending = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.isSending = false;
      this.cdr.detectChanges();
    }, 3000);
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

  formatDate(dateValue : string) {
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const date = new Date(dateValue);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `Le ${day} ${month} ${year} à ${hours}:${minutes}`;
  }

  copyToClipboard(botResponse : string, index : string,id:string): void {
    navigator.clipboard.writeText(botResponse).then(() => {
      this.checkAction(index);
      this.openSnackBar('Copier dans le presse-papier !','mat_snack_green');
    }, (err) => {
      console.error('Failed to copy bot response to clipboard', err);
    });
  }

  likeResponse(botResponse : string, index : string,id:string): void {
    this.checkAction(index);
     // Send the like to the Database
     this.message_id = id;
     this.openSnackBar('Votre avis a bien été pris en compte !','mat_snack_green');
     this.sendLike();
  }

  sendLike(){
    this.apiService.getFeedbackByChatId(this.message_id).subscribe({
      next: (data: any) => {
        console.log('Feedback1 sent successfully');
          this.apiService.modifyFeedback(this.message_id, '', this.chatId, this.userID, this.botResponse,false,true).subscribe({
            next: (data: any) => {
              console.log('Feedback2 sent successfully');
            },
            error: (error) => {
              console.error('There was an error sending the feedback!', error);
            }
          });
      },
      error: (error) => {
        this.apiService.sendFeedback('', this.chatId, this.userID, this.botResponse,this.message_id,false,true).subscribe({
          next: (data: any) => {
            console.log('Feedback3 sent successfully');
          },
          error: (error) => {
            console.error('There was an error sending the feedback!', error);
          }
        });
      }
    });
  
  }

  dislikeResponse(botResponse : string, index : string,id:string): void {
    this.openDislike(botResponse, index, this.chatId,this.userMessage,id);
  }

  suggResponse(botResponse : string, index : string,id:string): void {
    this.openSugg(botResponse, index, this.chatId,this.userMessage,id);
  }

  checkAction(id : string, classname : string = 'greenColor'){
    document.getElementById(id)?.classList.add(classname);
    this.cdr.detectChanges();
    setTimeout(() => {
      document.getElementById(id)?.classList.remove(classname);
      this.cdr.detectChanges();
    }, 1500);
  }



  openDislike(botResponse : string, index : string, chat_id : string, chat_user:string,id:string) {
    const dialogRef = this.dialog.open(DislikeComponent, {
      width: '90%',
      maxWidth: '500px',
      data: { botResponse: botResponse, chat_id: chat_id, chat_user: chat_user,id:id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.buttonClicked == "send") {
        this.checkAction(index, 'redColor');
        // Envoi du dislike dans la bdd
        this.openSnackBar('Votre avis a bien été pris en compte !','mat_snack_red');
      }
     
    });
  }

  openSugg(botResponse : string, index : string, chat_id : string, chat_user:string,id:string ) {
    const dialogRef = this.dialog.open(SuggComponent, {
      width: '90%',
      maxWidth: '500px',
      data: { botResponse: botResponse, chat_id: chat_id, chat_user: chat_user,id:id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.buttonClicked == "send") {
        this.checkAction(index, 'blueColor');
        // Envoi de la suggestion dans la bdd
        this.openSnackBar('Votre suggestion a bien été prise en compte !','mat_snack_blue');
      }
    });
  }


  openSnackBar(message :string, classValue : string) {
    this._snackBar.openFromComponent(SnackComponent, {
      duration: 2500,
      panelClass: ['mat-toolbar', classValue],
      data: { message: message }
    });
  }

}

@Component({
  selector: 'dislike-component',
  templateUrl: 'dislike.component.html',
  styleUrls: ['dislike.component.scss'],
  standalone: true,
  imports: [MatIconModule, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, FormsModule ],
})
export class DislikeComponent {
  textContent: string = '';
  chat_id: string = '';
  constructor(
    public dialogRef: MatDialogRef<SuggComponent>,
    private apiService: ApiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { botResponse: string, chat_id: string, chat_user: string,id:string}
  ) {}

  ngOnInit(): void {
    this.chat_id = this.data.chat_id;
    console.log(this.data.chat_id);
  }

  onCloseWithResult(result: string): void {
    this.dialogRef.close({ buttonClicked: result, textareaContent: this.textContent });
    if (result === 'send') {
      this.sendSugg();
    }
  }

  sendSugg() {
    const sugg = this.textContent;
    const chat_id_user = this.apiService.getId();
    console.log("Hello bitch c'est l'hecatombe")
    console.log(this.data.id);
    this.apiService.getFeedbackByChatId(this.data.id).subscribe({
      next: (data: any) => {
        console.log('Feedback1 sent successfully');
          this.apiService.modifyFeedback(this.data.id, sugg, this.data.chat_id, chat_id_user, this.data.botResponse,false,false).subscribe({
            next: (data: any) => {
              console.log('Feedback2 sent successfully');
            },
            error: (error) => {
              console.error('There was an error sending the feedback!', error);
            }
          });
      },
      error: (error) => {
        this.apiService.sendFeedback(sugg, this.data.chat_id, chat_id_user, this.data.botResponse,this.data.id,false,false).subscribe({
          next: (data: any) => {
            console.log('Feedback3 sent successfully');
          },
          error: (error) => {
            console.error('There was an error sending the feedback!', error);
          }
        });
      }
    });
  }
}


@Component({
  selector: 'sugg-component',
  templateUrl: 'sugg.component.html',
  styleUrls: ['sugg.component.scss'],
  standalone: true,
  imports: [MatIconModule, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, FormsModule ],
})
export class SuggComponent {
  textContent: string = '';
  chat_id: string = '';
  route: any;
  constructor(
    public dialogRef: MatDialogRef<SuggComponent>,
    private apiService: ApiServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { botResponse: string, chat_id: string, chat_user: string,id:string}
  ) {}

  ngOnInit(): void {
    this.chat_id = this.data.chat_id;
    console.log(this.data.chat_user);
  }
  
  onCloseWithResult(result: string): void {
    this.dialogRef.close({ buttonClicked: result, textareaContent: this.textContent });
    if (result === 'send') {
      this.sendSugg();
    }
  }

  sendSugg() {
    const sugg = this.textContent;
    const chat_id_user = this.apiService.getId();

    this.apiService.getFeedbackByChatId(this.data.id).subscribe({
      next: (data: any) => {
        console.log('Feedback1 sent successfully');
          this.apiService.modifyFeedback(this.data.id, sugg, this.data.chat_id, chat_id_user, this.data.botResponse,true,false).subscribe({
            next: (data: any) => {
              console.log('Feedback2 sent successfully');
            },
            error: (error) => {
              console.error('There was an error sending the feedback!', error);
            }
          });
      },
      error: (error) => {
        this.apiService.sendFeedback(sugg, this.data.chat_id, chat_id_user, this.data.botResponse,this.data.id,true,false).subscribe({
          next: (data: any) => {
            console.log('Feedback3 sent successfully');
          },
          error: (error) => {
            console.error('There was an error sending the feedback!', error);
          }
        });
      }
    });
  }
  
}


@Component({
  selector: 'snack-component',
  templateUrl: 'snack.component.html',
  styleUrls: ['snack.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, FormsModule],
})
export class SnackComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string }
  ) {}
}
