import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SuggComponent } from './sugg/sugg.component';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path : "", component: LoginComponent},
    {path : "home", component: MainComponent},
    {path : "chat/:chat_id", component: MainComponent},
    {path: "feedback", component: SuggComponent, canActivate: [authGuard]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }