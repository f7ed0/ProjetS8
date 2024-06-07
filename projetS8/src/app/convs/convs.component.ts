import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { NewconvService } from '../newconv.service';
import {MatButtonModule} from '@angular/material/button';
import { UserService } from '../user.service';
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
  providers: [ApiServiceService]
})
export class ConvsComponent implements OnInit {
  convs: any = [];
  userID = this.apiService.getId();
  screenWidth: number = 0;

  constructor(
    private apiService: ApiServiceService, 
    private router: Router,
    private newconvService: NewconvService,
    private drawerService: DrawerService
  ) {}

  ngOnInit(): void {
    this.getDataDistinct();
    this.checkScreenWidth();
  }

  getDataDistinct(): void {
    this.apiService.getDataByUserId(this.userID).subscribe({
      next: (data: any) => {
        this.convs = data;
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
  }

  navigateToChat(chatId: string): void {
    this.newconvService.setMessages();
    this.router.navigate([`/chat/${chatId}`]);
    if(this.isMobile()) {
      this.toggleDrawer();
    }
  }

  setNewConv() {
    this.newconvService.setNewConv();
  }

  checkScreenWidth() {
    this.screenWidth = window.innerWidth;
  }

  isMobile(): boolean {
    return this.screenWidth < 768; 
  }

}
