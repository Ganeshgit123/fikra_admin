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
import { SettingsComponent } from './settings/settings.component';
import { CategorySubCategoryComponent } from './settings/category-sub-category/category-sub-category.component';
import { StartAProjectComponent } from './start-a-project/start-a-project.component';
import { ViewInvestorsComponent } from './view-investors/view-investors.component';
import { FaqComponent } from './faq/faq.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { ViewCreatorsComponent } from './view-creators/view-creators.component';
import { CountryCityComponent } from './settings/country-city/country-city.component';
import { TagsComponent } from './settings/tags/tags.component';
import { InvestorFormComponent } from './investor-form/investor-form.component';
import { CreatorsFormComponent } from './creators-form/creators-form.component';
import { AddInvestorFieldComponent } from './investor-form/add-investor-field/add-investor-field.component';
import { EditInvestorFieldComponent } from './investor-form/edit-investor-field/edit-investor-field.component';
import { AddCreatorFieldComponent } from './creators-form/add-creator-field/add-creator-field.component';
import { EditCreatorFieldComponent } from './creators-form/edit-creator-field/edit-creator-field.component';
import { CreatorHandbookComponent } from './creator-handbook/creator-handbook.component';
import { RequestBackProjectComponent } from './projects/request-back-project/request-back-project.component';
import { RecommendedProjectsComponent } from './projects/recommended-projects/recommended-projects.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AddHandbookComponent } from './creator-handbook/add-handbook/add-handbook.component';
import { EditHandbookComponent } from './creator-handbook/edit-handbook/edit-handbook.component';
import { SpecialServicesComponent } from './settings/special-services/special-services.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { SpecialRequestsComponent } from './special-requests/special-requests.component';
import { CareerComponent } from './career/career.component';
import { ProjectReportsComponent } from './projects/project-reports/project-reports.component';

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
      {path: 'projects',component: ProjectsComponent, canActivate: [AuthGuard],},
      {path: 'requested_projects',component: RequestBackProjectComponent, canActivate: [AuthGuard],},
      {path: 'recommended_projects',component: RecommendedProjectsComponent, canActivate: [AuthGuard],},
      {path: 'view-projects/:id',component: ViewProjectsComponent, canActivate: [AuthGuard]},
      {path: 'creators',component: CreatorsComponent, canActivate: [AuthGuard],},
      {path: 'view-creators/:id',component: ViewCreatorsComponent, canActivate: [AuthGuard]},
      {path: 'privacy',component: PrivacyPolicyComponent, canActivate: [AuthGuard],},
      {path: 'cookie_policy',component: CookiePolicyComponent, canActivate: [AuthGuard],},
      {path: 'terms_of_use',component: TermsOfUseComponent, canActivate: [AuthGuard],},
      {path: 'home_page',component: UserHomePageComponent, canActivate: [AuthGuard],},
      {path: 'about_page',component: AboutPageComponent, canActivate: [AuthGuard],},
      {path: 'creator_handbook',component: CreatorHandbookComponent, canActivate: [AuthGuard],},
      {path: 'add_handbook',component: AddHandbookComponent, canActivate: [AuthGuard],},
      {path: 'edit_handbook/:id',component: EditHandbookComponent, canActivate: [AuthGuard],},
      {path: 'settings',component: SettingsComponent, canActivate: [AuthGuard],},
      {path: 'investor_form',component: InvestorFormComponent, canActivate: [AuthGuard],},
      {path: 'creator_form',component: CreatorsFormComponent, canActivate: [AuthGuard],},
      {path: 'add-investor-field',component: AddInvestorFieldComponent, canActivate: [AuthGuard]},
      {path: 'edit-investor-field/:id',component: EditInvestorFieldComponent, canActivate: [AuthGuard]},
      {path: 'add-creator-field',component: AddCreatorFieldComponent, canActivate: [AuthGuard]},
      {path: 'edit-creator-field/:id',component: EditCreatorFieldComponent, canActivate: [AuthGuard]},
      {path: 'faq',component: FaqComponent, canActivate: [AuthGuard],},
      {path: 'start_project_page',component: StartAProjectComponent, canActivate: [AuthGuard],},
      {path: 'category_sub_category',component: CategorySubCategoryComponent, canActivate: [AuthGuard],},
      {path: 'country_city',component: CountryCityComponent, canActivate: [AuthGuard],},
      {path: 'tags',component: TagsComponent, canActivate: [AuthGuard],},
      {path: 'contact',component: ContactUsComponent, canActivate: [AuthGuard],},
      {path: 'special_services',component: SpecialServicesComponent, canActivate: [AuthGuard],},
      {path: 'subscribers',component: SubscribersComponent, canActivate: [AuthGuard],},
      {path: 'special_requests',component: SpecialRequestsComponent, canActivate: [AuthGuard],},
      {path: 'career',component: CareerComponent, canActivate: [AuthGuard],},
      {path: 'project_reports',component: ProjectReportsComponent, canActivate: [AuthGuard],},
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
