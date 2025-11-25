import { Injectable, signal } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly app = signal<FirebaseApp | null>(null);
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    if (this.initialized) {
      return;
    }

    try {
      const firebaseConfig = environment.firebase;
      
      // Only initialize if config is provided
      if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        console.log('Initializing Firebase with config:', {
          projectId: firebaseConfig.projectId,
          authDomain: firebaseConfig.authDomain
        });
        const app = initializeApp(firebaseConfig);
        this.app.set(app);
        this.initialized = true;
        console.log('Firebase initialized successfully');
      } else {
        console.warn('Firebase config is incomplete:', firebaseConfig);
      }
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }

  getApp(): FirebaseApp | null {
    return this.app();
  }

  isInitialized(): boolean {
    return this.initialized && this.app() !== null;
  }
}

