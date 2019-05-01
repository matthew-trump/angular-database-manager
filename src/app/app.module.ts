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
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { MatSliderModule } from '@angular/material/slider';
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
import { EntityBasicComponent } from './entity-types/basic/entity-basic/entity-basic.component';
import { EntityBasicFormComponent } from './entity-types/basic/entity-basic-form/entity-basic-form.component';
import { ScheduleItemFormComponent } from './schedule-item-form/schedule-item-form.component';
import { PaginationControlsComponent } from './pagination-controls/pagination-controls.component';
import { PaginationBannerComponent } from './pagination-banner/pagination-banner.component';
import { PaginationPagesComponent } from './pagination-pages/pagination-pages.component';

import { EntityQuestionComponent } from './entity-types/question/entity-question/entity-question.component';
import { EntityQuestionFormComponent } from './entity-types/question/entity-question-form/entity-question-form.component';
import { EntityDisplayEnablementToggleComponent } from './entity-display-enablement-toggle/entity-display-enablement-toggle.component';
import { EntityListIndexComponent } from './entity-list-index/entity-list-index.component';

import { EntityLiteraryWorkComponent } from './entity-types/literary-work/entity-literary-work/entity-literary-work.component';
import { EntityLiteraryWorkFormComponent } from './entity-types/literary-work/entity-literary-work-form/entity-literary-work-form.component';
import { EntityLiteraryQuoteComponent } from './entity-types/literary-quote/entity-literary-quote/entity-literary-quote.component';
import { EntityLiteraryQuoteFormComponent } from './entity-types/literary-quote/entity-literary-quote-form/entity-literary-quote-form.component';
import { EntityFormInputAutocompleteComponent } from './entity-form-input-autocomplete/entity-form-input-autocomplete.component';
import { EntityFormButtonsComponent } from './entity-form-buttons/entity-form-buttons.component';
import { EntityFormInputTextareaComponent } from './entity-form-input-textarea/entity-form-input-textarea.component';
import { EntityFormInputAutocompleteIndexComponent } from './entity-form-input-autocomplete-index/entity-form-input-autocomplete-index.component';

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
    EntityBasicComponent,
    EntityBasicFormComponent,
    ScheduleItemFormComponent,
    PaginationControlsComponent,
    PaginationBannerComponent,
    PaginationPagesComponent,

    EntityQuestionComponent,
    EntityQuestionFormComponent,
    EntityDisplayEnablementToggleComponent,
    EntityListIndexComponent,

    EntityLiteraryWorkComponent,
    EntityLiteraryWorkFormComponent,
    EntityLiteraryQuoteComponent,
    EntityLiteraryQuoteFormComponent,
    EntityFormInputAutocompleteComponent,
    EntityFormButtonsComponent,
    EntityFormInputTextareaComponent,
    EntityFormInputAutocompleteIndexComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    MatSlideToggleModule,
    MatSliderModule,
    MatAutocompleteModule
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
