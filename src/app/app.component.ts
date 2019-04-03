import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ConfigSchemaService } from './config-schema.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Actions on Google Admin Client';
  constructor(
    public authService: AuthService,
    public configSchemaService: ConfigSchemaService,
    private router: Router) {
    this.authService.loadCurrentSchema().then(loaded => {
      if (!loaded) {
        this.router.navigate(['login']);
      }
    });

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
