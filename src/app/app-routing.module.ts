import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { TestApiComponent } from './test-api/test-api.component';

const routes: Routes = [
    { path: 'login', pathMatch: 'full', component: LoginComponent },
    { path: 'test-api', pathMatch: 'full', component: TestApiComponent },
    {
        path: 'admin', canActivate: [AuthGuard],
        children: [
        ]
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
