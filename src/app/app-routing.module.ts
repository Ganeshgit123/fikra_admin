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
import { PrivacyPolicyComponent } from './cms/privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './cms/cookie-policy/cookie-policy.component';
import { TermsOfUseComponent } from './cms/terms-of-use/terms-of-use.component';
import { UserHomePageComponent } from './cms/user-home-page/user-home-page.component';
import { AboutPageComponent } from './cms/about-page/about-page.component';
import { SettingsComponent } from './settings/settings.component';
import { CategorySubCategoryComponent } from './settings/category-sub-category/category-sub-category.component';
import { StartAProjectComponent } from './cms/start-a-project/start-a-project.component';
import { ViewInvestorsComponent } from './investors/view-investors/view-investors.component';
import { FaqComponent } from './cms/faq/faq.component';
import { ViewProjectsComponent } from './projects/view-projects/view-projects.component';
import { ViewCreatorsComponent } from './creators/view-creators/view-creators.component';
import { CountryCityComponent } from './settings/country-city/country-city.component';
import { TagsComponent } from './settings/tags/tags.component';
import { InvestorFormComponent } from './investor-form/investor-form.component';
import { CreatorsFormComponent } from './creators-form/creators-form.component';
import { AddInvestorFieldComponent } from './investor-form/add-investor-field/add-investor-field.component';
import { EditInvestorFieldComponent } from './investor-form/edit-investor-field/edit-investor-field.component';
import { AddCreatorFieldComponent } from './creators-form/add-creator-field/add-creator-field.component';
import { EditCreatorFieldComponent } from './creators-form/edit-creator-field/edit-creator-field.component';
import { CreatorHandbookComponent } from './cms/creator-handbook/creator-handbook.component';
import { RequestBackProjectComponent } from './projects/request-back-project/request-back-project.component';
import { RecommendedProjectsComponent } from './projects/recommended-projects/recommended-projects.component';
import { ContactUsComponent } from './cms/contact-us/contact-us.component';
import { AddHandbookComponent } from './cms/creator-handbook/add-handbook/add-handbook.component';
import { EditHandbookComponent } from './cms/creator-handbook/edit-handbook/edit-handbook.component';
import { SpecialServicesComponent } from './settings/special-services/special-services.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { TemplateComponent } from './template/template.component';
import { SpecialRequestsComponent } from './special-requests/special-requests.component';
import { CareerComponent } from './cms/career/career.component';
import { ProjectReportsComponent } from './projects/project-reports/project-reports.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RolesComponent } from './roles/roles.component';
import { PermissionComponent } from './roles/permission/permission.component';
import { AdminUsersComponent } from './roles/admin-users/admin-users.component';
import { BillGenerationComponent } from './bill-generation/bill-generation.component';
import { InvoicePreviewComponent } from './bill-generation/invoice-preview/invoice-preview.component';
import { CommissionChargesComponent } from './settings/commission-charges/commission-charges.component';
import { AddNewBillComponent } from './bill-generation/add-new-bill/add-new-bill.component';
import { EditNewBillComponent } from './bill-generation/edit-new-bill/edit-new-bill.component';
import { SmsCampaignComponent } from './sms-campaign/sms-campaign.component';
import { ProjectConentComponent } from './cms/project-conent/project-conent.component';
import { CreateProjectComponent } from './cms/create-project/create-project.component';
import { BankAccountListsComponent } from './creators/bank-account-lists/bank-account-lists.component';
import { EditTemplateComponent } from './template/edit-template/edit-template.component';
import { HelpGuideComponent } from './cms/help-guide/help-guide.component';
import { TransactionComponent } from './projects/transaction/transaction.component';
import { ReportsComponent } from './reports/reports.component';
import { ChangeRequestUserComponent } from './roles/change-request-user/change-request-user.component';
import { TranslationsComponent } from './translations/translations.component';
import { UserDeleteListComponent } from './user-delete-list/user-delete-list.component';
import { MailMsgsComponent } from './settings/mail-msgs/mail-msgs.component';
import { WhatWeDoComponent } from './cms/what-we-do/what-we-do.component';
import { FeesComponent } from './cms/fees/fees.component';
import { OurRulesComponent } from './cms/our-rules/our-rules.component';
import { TrustSafetyComponent } from './cms/trust-safety/trust-safety.component';

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
      {path: 'transactions/:id',component: TransactionComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_project_true'}},
      
      {path: 'creators',component: CreatorsComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_creator_true'}},
      {path: 'view-creators/:id',component: ViewCreatorsComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_creator_true'}},
      {path: 'bank_ac_request_lists/:id',component: BankAccountListsComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_creator_true'}},

      
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
      {path: 'help_guide',component: HelpGuideComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'what_we_do',component: WhatWeDoComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'fees',component: FeesComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'our_rules',component: OurRulesComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      {path: 'trust_and_safety',component: TrustSafetyComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_content_true'}},
      
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
      {path: 'mail_messages',component: MailMsgsComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_setting_true'}},

      {path: 'subscribers',component: SubscribersComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_subscribers_true'}},
      {path: 'special_requests',component: SpecialRequestsComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_specialRequest_true'}},
      {path: 'special_requests/:id',component: SpecialRequestsComponent, canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_specialRequest_true'}},
      
      {path: 'roles',component: RolesComponent, canActivate: [AuthGuard],},
      {path: 'permissions/:id',component: PermissionComponent, canActivate: [AuthGuard],},
      {path: 'admin_users',component: AdminUsersComponent, canActivate: [AuthGuard],},
      {path: 'user_write_request',component: ChangeRequestUserComponent, canActivate: [AuthGuard],},
      
      {path: 'bill_list',component: BillGenerationComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_invoice_true'}},
      {path: 'invoice_bill/:id',component: InvoicePreviewComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_invoice_true'}},
      {path: 'add_new_bill/:id/:user_id/:project_id',component: AddNewBillComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_invoice_true'}},
      {path: 'add_new_bill/:id/:user_id/:project_id/:invoice_Id',component: AddNewBillComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_invoice_true'}},
      {path: 'add_new_bill/:id/:user_id',component: AddNewBillComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_invoice_true'}},
      {path: 'edit_new_bill/:id',component: EditNewBillComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_invoice_true'}},

      {path: 'template',component: TemplateComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_templates_true'}},
      {path: 'edit_template/:id',component: TemplateComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_templates_true'}},

      {path: 'sms_campaign',component: SmsCampaignComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_smsCampaign_true'}},

      {path: 'reports',component: ReportsComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_reports_true'}},

      {path: 'translation',component: TranslationsComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_translation_true'}},

      {path: 'notifications',component: NotificationsComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_notification_true'}},

      {path: 'delete_request',component: UserDeleteListComponent,canActivate: [AuthGuard,RoleGuardService],data: { expectedRole: '_accountDeleteRequest_true'}},



    ],
    canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
