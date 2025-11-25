import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes,  withComponentInputBinding()),
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
    }),
    provideHttpClient(
      withInterceptors([authHttpInterceptorFn])
    ),
    // Firebase providers (only if config is provided)
    ...(environment.firebase.apiKey && environment.firebase.projectId ? [
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideFirestore(() => getFirestore()),
      ...(environment.firebase.databaseURL ? [provideDatabase(() => getDatabase())] : [])
    ] : [])
  ]
};
