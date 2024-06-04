import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

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
    RouterModule
  ],
  templateUrl: './convs.component.html',
  styleUrls: ['./convs.component.scss'],
  providers: [ApiServiceService]
})
export class ConvsComponent implements OnInit {
  convs: any = [];

  constructor(private apiService: ApiServiceService, private router: Router) {}

  ngOnInit(): void {
    this.getDataDistinct();
  }

  getDataDistinct(): void {
    this.apiService.getDataDistinct().subscribe({
      next: (data: any) => {
        console.log('Data received from API:', data); // Log the received data
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

  navigateToChat(chatId: string): void {
    this.router.navigate([`/chat/${chatId}`]);
  }
}
