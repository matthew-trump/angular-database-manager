import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Actions on Google Admin Client';
  constructor(
    public authService: AuthService,
    private router: Router) {
    this.authService.loadCurrentSchema();

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
