import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule, } from '@angular/common';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuardService } from './auth/role-guard.service';
import { BrowserModule  } from '@angular/platform-browser';
import { LayoutComponent } from './layouts/layout/layout.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { InvestorsComponent } from './investors/investors.component';
import { CreatorsComponent } from './creators/creators.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
      path: '',
      component: LoginComponent
    },
    { path: '', 
    component: LayoutComponent, 
    children: [
      { path: 'dashboard', component: DashboardComponent ,canActivate: [AuthGuard]},
      {path: 'investors',component: InvestorsComponent, canActivate: [AuthGuard]},
      {path: 'projects',component: ProjectsComponent, canActivate: [AuthGuard],},
      {path: 'creators',component: CreatorsComponent, canActivate: [AuthGuard],},
      { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
      { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
    ],
    canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes, { scrollPositionRestoration: 'top',useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
