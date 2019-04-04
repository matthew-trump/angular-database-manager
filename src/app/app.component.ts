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
    const target: string = this.authService.currentTarget;
    this.configSchemaService.loadSchema(target).then(loaded => {
      console.log(loaded);
      if (!loaded) {
        console.log("LOGGING OUT");
        this.logout();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
