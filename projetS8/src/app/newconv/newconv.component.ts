import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-newconv',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatIconModule],
  templateUrl: './newconv.component.html',
  styleUrl: './newconv.component.scss'
})
export class NewconvComponent {

}
