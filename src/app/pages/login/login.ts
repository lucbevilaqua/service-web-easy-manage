import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ZardLoaderComponent } from '@shared/components/loader/loader.component';

@Component({
  selector: 'app-login',
  imports: [ZardLoaderComponent],
  templateUrl: './login.html',
})
export class Login {
  auth = inject(AuthService);

  constructor() {
    this.auth.loginWithRedirect();
  }
}
