import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { ConfigStateReducer } from './config-state.reducer';
import { LoginComponent } from './login/login.component';
import { TestApiComponent } from './test-api/test-api.component';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
/**
import { MatCheckboxModule} from '@angular/material';
import { MatSidenavModule} from '@angular/material/sidenav';



import { MatTabsModule } from '@angular/material/tabs';


import { MatRadioModule } from '@angular/material/radio';
 */

import { AppComponent } from './app.component';
import { ConfigSchemaComponent } from './config-schema/config-schema.component';
import { EntitiesComponent } from './entities/entities.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CurrentComponent } from './current/current.component';
import { InstanceDisplayBasicComponent } from './instance-display-basic/instance-display-basic.component';
import { ScheduleItemDetailsComponent } from './schedule-item-details/schedule-item-details.component';
import { EntityFormComponent } from './entity-form/entity-form.component';
import { ScheduleItemFormComponent } from './schedule-item-form/schedule-item-form.component';
import { PaginationControlsComponent } from './pagination-controls/pagination-controls.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TestApiComponent,
    ConfigSchemaComponent,
    EntitiesComponent,
    ScheduleComponent,
    CurrentComponent,
    InstanceDisplayBasicComponent,
    ScheduleItemDetailsComponent,
    EntityFormComponent,
    ScheduleItemFormComponent,
    PaginationControlsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ config: ConfigStateReducer }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatMomentDateModule,
    /** 
    MatCheckboxModule,
   
    MatSelectModule,
    MatSidenavModule,
    MatMenuModule,
    
    MatTabsModule,
   
   
    MatRadioModule
    */
  ],
  providers: [
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
