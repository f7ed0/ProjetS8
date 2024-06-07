import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { v4 as uuidv4 } from 'uuid';
import { ApiServiceService } from '../api-service.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { NewconvService } from '../newconv.service';

@Component({
  selector: 'app-newconv',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './newconv.component.html',
  styleUrls: ['./newconv.component.scss'],
})
export class NewconvComponent implements OnInit {
  userMessage: string = '';
  chat_id: string = '';

  constructor(
    private apiService: ApiServiceService,
    private userService: UserService,
    private router: Router,
    private newConvService: NewconvService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.newConvService.showNewConv$.subscribe(showNewConv => {
      console.log('showNewConv changed:', showNewConv);
      // Force change detection if necessary
      this.cdr.detectChanges();
    });
  }

  generateConv() {
    this.chat_id = uuidv4();
    this.apiService.postData(this.chat_id, this.userService.getId(), this.userMessage, "Smehli").subscribe(data => {
      console.log(data);
      this.newConvService.setMessages();
      this.router.navigate(['/chat', this.chat_id]).then(() => {
        console.log("Navigated to chat:", this.chat_id);
        this.cdr.detectChanges(); // Forcer la détection des changements après la navigation
      });
    });
  }
}  
