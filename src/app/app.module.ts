import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuardService } from './auth/role-guard.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ng6-toastr-notifications';

import { UiModule } from './shared/ui/ui.module';
import { WidgetModule } from './shared/widget/widget.module';
import { NgSelectModule } from '@ng-select/ng-select';

import {
  NgbNavModule, NgbDropdownModule, NgbTooltipModule, NgbPaginationModule, NgbTypeaheadModule,
  NgbDatepickerModule, NgbCollapseModule, NgbAccordionModule, NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DndModule } from 'ngx-drag-drop';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { LayoutsModule } from './layouts/layouts.module';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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

import { NewsletterContentComponent } from './cms/user-home-page/newsletter-content/newsletter-content.component';
import { BannerComponent } from './cms/user-home-page/banner/banner.component';
import { FeaturedTakingoffComponent } from './cms/user-home-page/featured-takingoff/featured-takingoff.component';
import { CreatorsCornerComponent } from './cms/user-home-page/creators-corner/creators-corner.component';
import { ClientLogosComponent } from './cms/user-home-page/client-logos/client-logos.component';
import { FooterContentComponent } from './cms/user-home-page/footer-content/footer-content.component';

import { ViewInvestorsComponent } from './investors/view-investors/view-investors.component';
import { FaqComponent } from './cms/faq/faq.component';
import { ViewProjectsComponent } from './projects/view-projects/view-projects.component';
import { StartBannerComponent } from './cms/start-a-project/start-banner/start-banner.component';
import { QuoteComponent } from './cms/start-a-project/quote/quote.component';
import { ProjectQComponent } from './cms/start-a-project/project-q/project-q.component';
import { VideoSectionComponent } from './cms/start-a-project/video-section/video-section.component';
import { WhyFikraComponent } from './cms/start-a-project/why-fikra/why-fikra.component';
import { ViewCreatorsComponent } from './creators/view-creators/view-creators.component';
import { CategoriesComponent } from './settings/category-sub-category/categories/categories.component';
import { SubCategoriesComponent } from './settings/category-sub-category/sub-categories/sub-categories.component';
import { CountriesComponent } from './settings/country-city/countries/countries.component';
import { CitiesComponent } from './settings/country-city/cities/cities.component';
import { CountryCityComponent } from './settings/country-city/country-city.component';
import { TagsComponent } from './settings/tags/tags.component';
import { MiddleSectionComponent } from './cms/about-page/middle-section/middle-section.component';
import { ContentSectionComponent } from './cms/about-page/content-section/content-section.component';
import { BasicInfoComponent } from './projects/view-projects/basic-info/basic-info.component';
import { RewardsComponent } from './projects/view-projects/rewards/rewards.component';

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
import { HandbookComponent } from './cms/start-a-project/handbook/handbook.component';
import { AddHandbookComponent } from './cms/creator-handbook/add-handbook/add-handbook.component';
import { EditHandbookComponent } from './cms/creator-handbook/edit-handbook/edit-handbook.component';
import { SpecialServicesComponent } from './settings/special-services/special-services.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { SpecialRequestsComponent } from './special-requests/special-requests.component';
import { CareerComponent } from './cms/career/career.component';
import { JobsComponent } from './cms/career/jobs/jobs.component';
import { ProjectReportsComponent } from './projects/project-reports/project-reports.component';
import { LikedProjectsComponent } from './projects/view-projects/liked-projects/liked-projects.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RolesComponent } from './roles/roles.component';
import { PermissionComponent } from './roles/permission/permission.component';
import { AdminUsersComponent } from './roles/admin-users/admin-users.component';
import { BillGenerationComponent } from './bill-generation/bill-generation.component';
import { InvoicePreviewComponent } from './bill-generation/invoice-preview/invoice-preview.component';
import { CommissionChargesComponent } from './settings/commission-charges/commission-charges.component';
import { AddNewBillComponent } from './bill-generation/add-new-bill/add-new-bill.component';
import { TemplateComponent } from './template/template.component';
import { SmsCampaignComponent } from './sms-campaign/sms-campaign.component';
import { CreateProjectComponent } from './cms/create-project/create-project.component';
import { BasicsComponent } from './cms/project-conent/basics/basics.component';
import { StoryComponent } from './cms/project-conent/story/story.component';
import { PaymentComponent } from './cms/project-conent/payment/payment.component';
import { PromotionComponent } from './cms/project-conent/promotion/promotion.component';
import { ProjectConentComponent } from './cms/project-conent/project-conent.component';
import { RewardContentComponent } from './cms/project-conent/reward-content/reward-content.component';
import { FirstTabContentComponent } from './cms/create-project/first-tab-content/first-tab-content.component';
import { SecondTabContentComponent } from './cms/create-project/second-tab-content/second-tab-content.component';
import { ThirdTabContentComponent } from './cms/create-project/third-tab-content/third-tab-content.component';
import { FourthTabContentComponent } from './cms/create-project/fourth-tab-content/fourth-tab-content.component';
import { BankAccountListsComponent } from './creators/bank-account-lists/bank-account-lists.component';
import { EditTemplateComponent } from './template/edit-template/edit-template.component';
import { HelpGuideComponent } from './cms/help-guide/help-guide.component';
import { TransactionComponent } from './projects/transaction/transaction.component';
import { ReportsComponent } from './reports/reports.component';
import { ChangeRequestUserComponent } from './roles/change-request-user/change-request-user.component';
import { TranslationsComponent } from './translations/translations.component';
import { TemplateServeComponent } from './subscribers/template-serve/template-serve.component';
import { TransactionReportComponent } from './reports/transaction-report/transaction-report.component';
import { ModelRelatedReportComponent } from './reports/model-related-report/model-related-report.component';
import { RequestPageComponent } from './cms/project-conent/request-page/request-page.component';
import { CMSComponent } from './cms/cms.component';
import { UserDeleteListComponent } from './user-delete-list/user-delete-list.component';
import { MailMsgsComponent } from './settings/mail-msgs/mail-msgs.component';
import { BankDetailsComponent } from './projects/view-projects/bank-details/bank-details.component';
import { WhatWeDoComponent } from './cms/what-we-do/what-we-do.component';
import { BannerSectionComponent } from './cms/what-we-do/banner-section/banner-section.component';
import { JourneySectionComponent } from './cms/what-we-do/journey-section/journey-section.component';
import { RightImageSectionComponent } from './cms/what-we-do/right-image-section/right-image-section.component';
import { SubscriptionSectionComponent } from './cms/what-we-do/subscription-section/subscription-section.component';
import { LeftVideoSectionComponent } from './cms/what-we-do/left-video-section/left-video-section.component';
import { ThreeContentSectionComponent } from './cms/what-we-do/three-content-section/three-content-section.component';
import { FeesComponent } from './cms/fees/fees.component';
import { OurRulesComponent } from './cms/our-rules/our-rules.component';
import { TrustSafetyComponent } from './cms/trust-safety/trust-safety.component';
import { FeesBannerComponent } from './cms/fees/fees-banner/fees-banner.component';
import { FeesAccordianComponent } from './cms/fees/fees-accordian/fees-accordian.component';
import { RulesBannerComponent } from './cms/our-rules/rules-banner/rules-banner.component';
import { RulesMiddleContentComponent } from './cms/our-rules/rules-middle-content/rules-middle-content.component';
import { RulesAccordianComponent } from './cms/our-rules/rules-accordian/rules-accordian.component';
import { TrustBannerComponent } from './cms/trust-safety/trust-banner/trust-banner.component';
import { TrustMiddleSectionComponent } from './cms/trust-safety/trust-middle-section/trust-middle-section.component';
import { TrustTabSectionComponent } from './cms/trust-safety/trust-tab-section/trust-tab-section.component';
import { FeaturedProjectsComponent } from './projects/featured-projects/featured-projects.component';
import { TakingOffProjectsComponent } from './projects/taking-off-projects/taking-off-projects.component';
import { HomeStretchComponent } from './projects/home-stretch/home-stretch.component';
import { HomeBannerComponent } from './projects/home-banner/home-banner.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 0.3
};

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent, ProjectsComponent, InvestorsComponent, CreatorsComponent, LoginComponent,
    PrivacyPolicyComponent, CookiePolicyComponent, TermsOfUseComponent,
    UserHomePageComponent, AboutPageComponent, SettingsComponent, CategorySubCategoryComponent,
    StartAProjectComponent, NewsletterContentComponent, BannerComponent, FeaturedTakingoffComponent,
    CreatorsCornerComponent, ClientLogosComponent, FooterContentComponent, ViewInvestorsComponent, FaqComponent,
    ViewProjectsComponent, StartBannerComponent, QuoteComponent,
    ProjectQComponent, VideoSectionComponent, WhyFikraComponent, ViewCreatorsComponent, CategoriesComponent, SubCategoriesComponent,
    CountriesComponent, CitiesComponent, CountryCityComponent, TagsComponent, MiddleSectionComponent,
    ContentSectionComponent, BasicInfoComponent, RewardsComponent, InvestorFormComponent,
    CreatorsFormComponent, AddInvestorFieldComponent, EditInvestorFieldComponent, AddCreatorFieldComponent, EditCreatorFieldComponent, 
    CreatorHandbookComponent, RequestBackProjectComponent, RecommendedProjectsComponent, ContactUsComponent, HandbookComponent, AddHandbookComponent,
    EditHandbookComponent, SpecialServicesComponent, SubscribersComponent, SpecialRequestsComponent, CareerComponent, JobsComponent, 
    ProjectReportsComponent, LikedProjectsComponent, NotificationsComponent, RolesComponent, PermissionComponent, AdminUsersComponent,
    BillGenerationComponent, InvoicePreviewComponent, CommissionChargesComponent, AddNewBillComponent, TemplateComponent, SmsCampaignComponent, 
    CreateProjectComponent, BasicsComponent, StoryComponent, PaymentComponent, PromotionComponent, ProjectConentComponent, RewardContentComponent, 
    FirstTabContentComponent, SecondTabContentComponent, ThirdTabContentComponent, FourthTabContentComponent, BankAccountListsComponent, 
    EditTemplateComponent, HelpGuideComponent, TransactionComponent, ReportsComponent, ChangeRequestUserComponent, TranslationsComponent, 
    TemplateServeComponent, TransactionReportComponent, ModelRelatedReportComponent, RequestPageComponent, CMSComponent, UserDeleteListComponent,
    MailMsgsComponent, BankDetailsComponent, WhatWeDoComponent, BannerSectionComponent, JourneySectionComponent, RightImageSectionComponent, 
    SubscriptionSectionComponent, LeftVideoSectionComponent, ThreeContentSectionComponent, FeesComponent, OurRulesComponent, TrustSafetyComponent,
    FeesBannerComponent, FeesAccordianComponent, RulesBannerComponent, RulesMiddleContentComponent, RulesAccordianComponent, TrustBannerComponent, 
    TrustMiddleSectionComponent, TrustTabSectionComponent, FeaturedProjectsComponent, TakingOffProjectsComponent, HomeStretchComponent, HomeBannerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    LayoutsModule,
    UiModule,
    CKEditorModule,
    Ng2SearchPipeModule,
    NgbNavModule,
    NgSelectModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    PerfectScrollbarModule,
    DndModule,
    FullCalendarModule,
    WidgetModule,
    NgxSpinnerModule,
    NgbAccordionModule,
    NgbAlertModule,
    NgbCollapseModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    AuthGuard, RoleGuardService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
