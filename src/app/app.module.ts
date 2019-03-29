import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth.guard';
import { AppRoutingModule } from './app-routing.module';


import { LoginComponent } from './login/login.component';
import { TestApiComponent } from './test-api/test-api.component';

/**
import { MatCheckboxModule} from '@angular/material';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatSelectModule} from '@angular/material/select';
import { MatMenuModule} from '@angular/material/menu'

import { MatTabsModule } from '@angular/material/tabs';


import { MatRadioModule } from '@angular/material/radio';
 */

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TestApiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    /** 
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatMomentDateModule ,
    MatSelectModule,
    MatSidenavModule,
    MatMenuModule,
    
    MatTabsModule,
   
   
    MatRadioModule
    */
  ],
  providers: [
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
