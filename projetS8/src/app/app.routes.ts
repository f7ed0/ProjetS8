import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { SuggComponent } from './sugg/sugg.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    {path : "home", component: MainComponent},
    {path: 'feedback', component: SuggComponent, canActivate: [authGuard] }
];
