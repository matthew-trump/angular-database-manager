import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ConfigSchemaService } from './config-schema.service';
import { environment } from 'src/environments/environment';

const DEFAULT_TITLE: string = 'Actions on Google Database Manager';
const TARGETS: any = environment.targets;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public TARGETS = TARGETS;
  public title: string = DEFAULT_TITLE;
  constructor(
    public authService: AuthService,
    public configSchemaService: ConfigSchemaService,
    private router: Router) {
    const target: string = this.authService.currentTarget;
    console.log(TARGETS);
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
