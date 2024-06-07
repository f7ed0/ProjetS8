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
    MatButtonModule
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
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.userID = this.apiService.getId();
  }

  ngOnInit(): void {
    this.getDataDistinct();
    this.checkScreenWidth();

    // Subscribe to the observable to detect changes when showNewConv changes
    this.newconvService.showNewConv$.subscribe(showNewConv => {
      this.cdr.detectChanges();
    });
  }

  getDataDistinct(): void {
    this.apiService.getDataByUserId(this.userID).subscribe({
      next: (data: any) => {
        this.convs = data;
        this.cdr.detectChanges(); // Detect changes after data is updated
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
    this.cdr.detectChanges(); // Detect changes after drawer is toggled
  }


  navigateToChat(chatId: string): void {
    this.newconvService.setMessages();
    this.router.navigate([`/chat/${chatId}`]).then(() => {
      this.cdr.detectChanges(); // Detect changes after navigation
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
    this.cdr.detectChanges(); // Detect changes after setting new conversation
    this.router.navigate(['/home']);
  }

  checkScreenWidth() {
    this.screenWidth = window.innerWidth;
    this.cdr.detectChanges(); // Detect changes after checking screen width
  }

  isMobile(): boolean {
    return this.screenWidth < 768; 
  }
  
  refreshConvs() {
    this.getDataDistinct();
    this.cdr.detectChanges(); // Detect changes after refreshing conversations
  }
}
