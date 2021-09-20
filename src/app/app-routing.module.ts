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
import { TemplateComponent } from './template/template.component';
import { SpecialRequestsComponent } from './special-requests/special-requests.component';
import { CareerComponent } from './career/career.component';
import { ProjectReportsComponent } from './projects/project-reports/project-reports.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RolesComponent } from './roles/roles.component';
import { PermissionComponent } from './roles/permission/permission.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { BillGenerationComponent } from './bill-generation/bill-generation.component';
import { InvoicePreviewComponent } from './bill-generation/invoice-preview/invoice-preview.component';
import { CommissionChargesComponent } from './settings/commission-charges/commission-charges.component';
import { AddNewBillComponent } from './bill-generation/add-new-bill/add-new-bill.component';
import { EditNewBillComponent } from './bill-generation/edit-new-bill/edit-new-bill.component';
import { SmsCampaignComponent } from './sms-campaign/sms-campaign.component';
import { ProjectConentComponent } from './project-conent/project-conent.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { BankAccountListsComponent } from './creators/bank-account-lists/bank-account-lists.component';

const routes: Routes = [
  {
      path: '',
      component: LoginComponent
    },
    { path: '', 
    component: LayoutComponent, 
    children: [
      { path: 'dashboard', component: DashboardComponent ,canActivate: [AuthGuard]},
      
      {path: 'investors',component: InvestorsComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_investor_true'}},
      {path: 'view-investors/:id',component: ViewInvestorsComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_investor_true'}},
      
      {path: 'projects',component: ProjectsComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_project_true'}},
      {path: 'requested_projects',component: RequestBackProjectComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_project_true'}},
      {path: 'recommended_projects',component: RecommendedProjectsComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_project_true'}},
      {path: 'view-projects/:id',component: ViewProjectsComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_project_true'}},
      {path: 'project_reports',component: ProjectReportsComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_project_true'}},
      
      {path: 'creators',component: CreatorsComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_creator_true'}},
      {path: 'view-creators/:id',component: ViewCreatorsComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_creator_true'}},
      {path: 'bank_ac_request_lists',component: BankAccountListsComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_creator_true'}},

      
      {path: 'privacy',component: PrivacyPolicyComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'cookie_policy',component: CookiePolicyComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'terms_of_use',component: TermsOfUseComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'home_page',component: UserHomePageComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'about_page',component: AboutPageComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'creator_handbook',component: CreatorHandbookComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'add_handbook',component: AddHandbookComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'edit_handbook/:id',component: EditHandbookComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'faq',component: FaqComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'start_project_page',component: StartAProjectComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'contact',component: ContactUsComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'career',component: CareerComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'project_content',component: ProjectConentComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'create_project',component: CreateProjectComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},

      {path: 'investor_form',component: InvestorFormComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_signUpForm_true'}},
      {path: 'creator_form',component: CreatorsFormComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_signUpForm_true'}},
      {path: 'add-investor-field',component: AddInvestorFieldComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_signUpForm_true'}},
      {path: 'edit-investor-field/:id',component: EditInvestorFieldComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_signUpForm_true'}},
      {path: 'add-creator-field',component: AddCreatorFieldComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_signUpForm_true'}},
      {path: 'edit-creator-field/:id',component: EditCreatorFieldComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_signUpForm_true'}},

      {path: 'settings',component: SettingsComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_setting_true'}},
      {path: 'category_sub_category',component: CategorySubCategoryComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_setting_true'}},
      {path: 'country_city',component: CountryCityComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_setting_true'}},
      {path: 'tags',component: TagsComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_setting_true'}},
      {path: 'special_services',component: SpecialServicesComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_setting_true'}},
      {path: 'commission_charges',component: CommissionChargesComponent,  canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_setting_true'}},

      {path: 'subscribers',component: SubscribersComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_subscribers_true'}},
      {path: 'special_requests',component: SpecialRequestsComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_specialRequest_true'}},
      {path: 'special_requests/:id',component: SpecialRequestsComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_specialRequest_true'}},

      {path: 'notifications',component: NotificationsComponent, canActivate: [AuthGuard],},
      {path: 'roles',component: RolesComponent, canActivate: [AuthGuard],},
      {path: 'permissions',component: PermissionComponent, canActivate: [AuthGuard],},
      {path: 'admin_users',component: AdminUsersComponent, canActivate: [AuthGuard],},
      
      {path: 'bill_list',component: BillGenerationComponent, canActivate: [AuthGuard],},
      {path: 'invoice_bill/:id',component: InvoicePreviewComponent, canActivate: [AuthGuard],},
      {path: 'add_new_bill/:id/:user_id',component: AddNewBillComponent, canActivate: [AuthGuard],},
      {path: 'edit_new_bill/:id',component: EditNewBillComponent,canActivate: [AuthGuard],},

      {path: 'template',component: TemplateComponent,canActivate: [AuthGuard],},
      {path: 'sms_campaign',component: SmsCampaignComponent,canActivate: [AuthGuard],},
      
    ],
    canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
