import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Dialogflow Admin Client Minimalist';

  /** good to display environment directly in interface, 
   * as you will want to keep track of which database you are connected to 
   * (local, staging, production) **/
  environmentName = environment.name;
  production: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router) {
    this.environmentName = environment.name;
    this.production = environment.production;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
    return false;
  }

}
