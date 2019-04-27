import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ConfigSchemaService } from './config-schema.service';
import { BackendApiService } from './backend-api.service';
import { environment } from 'src/environments/environment';
import { Schema } from './schema';
import { EntityConfig } from './entity-config';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';


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
  public entities: string[];
  public schedule: any;

  constructor(
    public authService: AuthService,
    public configSchemaService: ConfigSchemaService,
    public backendApiService: BackendApiService,
    private store: Store<any>,
    private titleService: Title,
    private router: Router) {
    console.log("TARGETS", this.TARGETS);
    this.store.select('config').subscribe((state: any) => {
      if (state.schema) {
        this.schedule = state.schema.schedule;
        this.entities = state.schema.entities.map((entityConfig: EntityConfig) => {
          return entityConfig.plural;
        });
        this.titleService.setTitle(TARGETS[backendApiService.target].title)
      } else if (state.target) {
        console.log("LOGGING OUT");
        this.logout();
        this.entities = null;
      }
    })

    this.configSchemaService.loadSchema(this.backendApiService.target);


  }


  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
