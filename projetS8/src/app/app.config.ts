import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { NewconvService } from './newconv.service';
import { UserService } from './user.service';
import { ApiServiceService } from './api-service.service';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideAnimations(), provideAnimationsAsync(),  provideHttpClient(),NewconvService,UserService,ApiServiceService,AuthService]
};
