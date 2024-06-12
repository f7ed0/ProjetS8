import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiServiceService } from '../api-service.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { NewconvService } from '../newconv.service';
import { MatButtonModule } from '@angular/material/button';
import { DrawerService } from '../drawer.service';
import { MessagesComponent } from '../messages/messages.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-convs',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
    MatButtonModule,
    MessagesComponent
  ],
  templateUrl: './convs.component.html',
  styleUrls: ['./convs.component.scss'],
})
export class ConvsComponent implements OnInit {
  convs: any = [];
  userID: string;
  screenWidth: number = 0;

  constructor(
    private apiService: ApiServiceService, 
    private router: Router,
    private newconvService: NewconvService,
    private drawerService: DrawerService,
    private cdr: ChangeDetectorRef,
    private userService : UserService
  ) {
    this.userID = this.apiService.getId();
  }

  ngOnInit(): void {
    this.getDataDistinct();
    this.checkScreenWidth();
    this.newconvService.showNewConv$.subscribe(showNewConv => {
      this.cdr.detectChanges();
    });
    if(this.userService.getChatId() != '') {
      setTimeout(() => {  this.addActiveClass(this.userService.getChatId()) }, 300);
      ;
    }
    this.removeActiveClass();
    this.cdr.detectChanges();
  }

  sortConvsByTimestamp() {
    this.convs.sort((a:any, b:any) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateB.getTime() - dateA.getTime();
      }
      return 0;
    });
  }
  
  getDataDistinct(): void {
    this.apiService.getDataByUserId(this.userID).subscribe({
      next: (data: any) => {
        this.convs = data;
        this.sortConvsByTimestamp();
        console.log(this.convs);
        this.cdr.detectChanges();
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

  toggleDrawer() {
    this.drawerService.toggleDrawer();
    this.cdr.detectChanges();
  }

  addActiveClass(id: string): void {
    this.removeActiveClass();
    let element = document.getElementById(`conv_${id}`);
    if (element != null) {
      element.classList.add('activeConv');
    }
    console.log(element);
  }

  removeActiveClass(): void {
    const elements = document.getElementsByClassName('activeConv');
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove('activeConv');
    }
  }


  convFormat(msg : string){
    let thresold = 70;
    if(msg.length > thresold){
      while(msg[thresold] != ' '){
        thresold--;
      }
      return msg.slice(0, thresold) + ' ...';
    }
    return msg;
  }


  navigateToChat(chatId: string): void {
    this.newconvService.setMessages();
    this.router.navigate([`/chat/${chatId}`]).then(() => {
      this.userService.setChatId(chatId);
      this.addActiveClass(chatId);
      this.cdr.detectChanges(); 
    });
    if (this.isMobile()) {
      this.toggleDrawer();
    }
    setTimeout(() => {  this.scrollToBottom(); }, 300);
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


  setNewConv() {
    this.newconvService.setNewConv();
    this.cdr.detectChanges();
    this.userService.setChatId('');
    this.router.navigate(['/home']);
  }

  checkScreenWidth() {
    this.screenWidth = window.innerWidth;
    this.cdr.detectChanges();
  }

  isMobile(): boolean {
    return this.screenWidth < 768; 
  }
  
  refreshConvs() {
    this.getDataDistinct();
    this.cdr.detectChanges(); 
  }
}
