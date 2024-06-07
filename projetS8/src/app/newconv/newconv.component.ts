import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {v4 as uuidv4} from 'uuid';
import { ApiServiceService } from '../api-service.service';
import { UserService } from '../user.service';
import { routes } from '../app.routes';
import { Router } from '@angular/router';
import { NewconvService } from '../newconv.service';

@Component({
  selector: 'app-newconv',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './newconv.component.html',
  styleUrl: './newconv.component.scss',
  providers: [ApiServiceService,UserService,NewconvService],
})
export class NewconvComponent {
  userMessage: string = '';
  chat_id: string = '';

  constructor(private apiService: ApiServiceService, private userService :UserService,private router: Router, private newConvService : NewconvService) { }

  ngOnInit(): void {
  }

  generateConv() {
    this.chat_id = uuidv4();
    this.apiService.postData(this.chat_id, this.userService.getId(), this.userMessage, "Smehli").subscribe((data) => {
      console.log(data);
      this.router.navigate(['/chat', this.chat_id]);
      this.newConvService.setMessages();
      console.log("pardon");
      console.log(this.newConvService.showNewConv$);
    });
  }


}
