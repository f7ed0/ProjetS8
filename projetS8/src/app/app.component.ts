import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotFoundComponentComponent } from './not-found-component/not-found-component.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NotFoundComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'projetS8';
}
