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
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { UserHomePageComponent } from './user-home-page/user-home-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { FieldeditComponent } from './fieldedit/fieldedit.component';
import { SettingsComponent } from './settings/settings.component';
import { CategorySubCategoryComponent } from './settings/category-sub-category/category-sub-category.component';
import { StartAProjectComponent } from './start-a-project/start-a-project.component';
import { ViewInvestorsComponent } from './view-investors/view-investors.component';
import { FaqComponent } from './faq/faq.component';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { ViewCreatorsComponent } from './view-creators/view-creators.component';
import { CountryCityComponent } from './settings/country-city/country-city.component';
import { TagsComponent } from './settings/tags/tags.component';
import { AddNewFieldsComponent } from './fieldedit/investor-field/add-new-fields/add-new-fields.component';
import { AddNewCreateFieldComponent } from './fieldedit/creator-field/add-new-create-field/add-new-create-field.component';

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
      {path: 'view-investors/:id',component: ViewInvestorsComponent, canActivate: [AuthGuard]},
      {path: 'requests',component: RequestListComponent, canActivate: [AuthGuard]},
      {path: 'view-requests/:id',component: RequestDetailsComponent, canActivate: [AuthGuard]},
      {path: 'projects',component: ProjectsComponent, canActivate: [AuthGuard],},
      {path: 'view-projects/:id',component: ViewProjectsComponent, canActivate: [AuthGuard]},
      {path: 'creators',component: CreatorsComponent, canActivate: [AuthGuard],},
      {path: 'view-creators/:id',component: ViewCreatorsComponent, canActivate: [AuthGuard]},
      {path: 'privacy',component: PrivacyPolicyComponent, canActivate: [AuthGuard],},
      {path: 'cookie_policy',component: CookiePolicyComponent, canActivate: [AuthGuard],},
      {path: 'terms_of_use',component: TermsOfUseComponent, canActivate: [AuthGuard],},
      {path: 'home_page',component: UserHomePageComponent, canActivate: [AuthGuard],},
      {path: 'about_page',component: AboutPageComponent, canActivate: [AuthGuard],},
      {path: 'settings',component: SettingsComponent, canActivate: [AuthGuard],},
      {path: 'form-field-edit',component: FieldeditComponent, canActivate: [AuthGuard],},
      {path: 'add-investor-field',component: AddNewFieldsComponent, canActivate: [AuthGuard]},
      {path: 'add-investor-field/:id',component: AddNewFieldsComponent, canActivate: [AuthGuard]},
      {path: 'add-new-create-field',component: AddNewCreateFieldComponent, canActivate: [AuthGuard]},
      {path: 'add-new-create-field/:id',component: AddNewCreateFieldComponent, canActivate: [AuthGuard]},
      {path: 'faq',component: FaqComponent, canActivate: [AuthGuard],},
      {path: 'start_project_page',component: StartAProjectComponent, canActivate: [AuthGuard],},
      {path: 'category_sub_category',component: CategorySubCategoryComponent, canActivate: [AuthGuard],},
      {path: 'country_city',component: CountryCityComponent, canActivate: [AuthGuard],},
      {path: 'tags',component: TagsComponent, canActivate: [AuthGuard],},
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
