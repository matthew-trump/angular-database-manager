import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { EntitiesComponent } from './entities/entities.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { CurrentComponent } from './current/current.component';
import { TestApiComponent } from './test-api/test-api.component';
import { ConfigSchemaComponent } from './config-schema/config-schema.component';

const routes: Routes = [
    { path: 'login', pathMatch: 'full', component: LoginComponent },
    { path: 'test-api', pathMatch: 'full', component: TestApiComponent },
    { path: 'schema', pathMatch: 'full', canActivate: [AuthGuard], component: ConfigSchemaComponent },
    {
        path: 'entities', canActivate: [AuthGuard],
        children: [
            { path: ':id', component: EntitiesComponent }
        ]
    },
    {
        path: 'schedule', canActivate: [AuthGuard],
        children: [
            { path: '', component: ScheduleComponent, pathMatch: 'full' },
            { path: ':id', component: ScheduleComponent }
        ]
    },
    {
        path: 'current', canActivate: [AuthGuard], component: CurrentComponent
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
