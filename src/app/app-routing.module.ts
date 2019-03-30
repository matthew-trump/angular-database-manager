import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { EntitiesComponent } from './entities/entities.component';
import { TestApiComponent } from './test-api/test-api.component';
import { ConfigSchemaComponent } from './config-schema/config-schema.component';

const routes: Routes = [
    { path: 'login', pathMatch: 'full', component: LoginComponent },
    { path: 'test-api', pathMatch: 'full', component: TestApiComponent },
    { path: 'config-schema', pathMatch: 'full', canActivate: [AuthGuard], component: ConfigSchemaComponent },
    {
        path: 'entities', canActivate: [AuthGuard],
        children: [
            { path: ':id', component: EntitiesComponent }
        ]
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
