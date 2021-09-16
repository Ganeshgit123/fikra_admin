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

import { NgbNavModule, NgbDropdownModule, NgbTooltipModule, NgbPaginationModule, NgbTypeaheadModule,
  NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
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

import { TablesModule } from './tables/tables.module';
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
import { NewsletterContentComponent } from './user-home-page/newsletter-content/newsletter-content.component';
import { BannerComponent } from './user-home-page/banner/banner.component';
import { FeaturedTakingoffComponent } from './user-home-page/featured-takingoff/featured-takingoff.component';
import { CreatorsCornerComponent } from './user-home-page/creators-corner/creators-corner.component';
import { ClientLogosComponent } from './user-home-page/client-logos/client-logos.component';
import { FooterContentComponent } from './user-home-page/footer-content/footer-content.component';

import { ViewInvestorsComponent } from './view-investors/view-investors.component';
import { FaqComponent } from './faq/faq.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { StartBannerComponent } from './start-a-project/start-banner/start-banner.component';
import { QuoteComponent } from './start-a-project/quote/quote.component';
import { ProjectQComponent } from './start-a-project/project-q/project-q.component';
import { VideoSectionComponent } from './start-a-project/video-section/video-section.component';
import { WhyFikraComponent } from './start-a-project/why-fikra/why-fikra.component';
import { ViewCreatorsComponent } from './view-creators/view-creators.component';
import { CategoriesComponent } from './settings/category-sub-category/categories/categories.component';
import { SubCategoriesComponent } from './settings/category-sub-category/sub-categories/sub-categories.component';
import { CountriesComponent } from './settings/country-city/countries/countries.component';
import { CitiesComponent } from './settings/country-city/cities/cities.component';
import { CountryCityComponent } from './settings/country-city/country-city.component';
import { TagsComponent } from './settings/tags/tags.component';
import { MiddleSectionComponent } from './about-page/middle-section/middle-section.component';
import { ContentSectionComponent } from './about-page/content-section/content-section.component';
import { BasicInfoComponent } from './view-projects/basic-info/basic-info.component';
import { RewardsComponent } from './view-projects/rewards/rewards.component';

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
import { HandbookComponent } from './start-a-project/handbook/handbook.component';
import { AddHandbookComponent } from './creator-handbook/add-handbook/add-handbook.component';
import { EditHandbookComponent } from './creator-handbook/edit-handbook/edit-handbook.component';
import { SpecialServicesComponent } from './settings/special-services/special-services.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { SpecialRequestsComponent } from './special-requests/special-requests.component';
import { CareerComponent } from './career/career.component';
import { JobsComponent } from './career/jobs/jobs.component';
import { ProjectReportsComponent } from './projects/project-reports/project-reports.component';
import { LikedProjectsComponent } from './view-projects/liked-projects/liked-projects.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RolesComponent } from './roles/roles.component';
import { PermissionComponent } from './roles/permission/permission.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { BillGenerationComponent } from './bill-generation/bill-generation.component';
import { InvoicePreviewComponent } from './bill-generation/invoice-preview/invoice-preview.component';
import { CommissionChargesComponent } from './settings/commission-charges/commission-charges.component';
import { AddNewBillComponent } from './bill-generation/add-new-bill/add-new-bill.component';
import { EditNewBillComponent } from './bill-generation/edit-new-bill/edit-new-bill.component';
import { TemplateComponent } from './template/template.component';
import { SmsCampaignComponent } from './sms-campaign/sms-campaign.component';
import { NewsletterViewComponent } from './template/newsletter-view/newsletter-view.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { BasicsComponent } from './project-conent/basics/basics.component';
import { StoryComponent } from './project-conent/story/story.component';
import { PaymentComponent } from './project-conent/payment/payment.component';
import { PromotionComponent } from './project-conent/promotion/promotion.component';
import { ProjectConentComponent } from './project-conent/project-conent.component';
import { RewardContentComponent } from './project-conent/reward-content/reward-content.component';
import { FirstTabContentComponent } from './create-project/first-tab-content/first-tab-content.component';
import { SecondTabContentComponent } from './create-project/second-tab-content/second-tab-content.component';
import { ThirdTabContentComponent } from './create-project/third-tab-content/third-tab-content.component';
import { FourthTabContentComponent } from './create-project/fourth-tab-content/fourth-tab-content.component';


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
    DashboardComponent, ProjectsComponent, InvestorsComponent, CreatorsComponent,LoginComponent, 
    PrivacyPolicyComponent, CookiePolicyComponent, TermsOfUseComponent, 
    UserHomePageComponent, AboutPageComponent, SettingsComponent, CategorySubCategoryComponent, 
    StartAProjectComponent, NewsletterContentComponent, BannerComponent, FeaturedTakingoffComponent,
    CreatorsCornerComponent, ClientLogosComponent, FooterContentComponent, ViewInvestorsComponent, FaqComponent,
    ViewProjectsComponent, StartBannerComponent, QuoteComponent, 
    ProjectQComponent, VideoSectionComponent, WhyFikraComponent, ViewCreatorsComponent, CategoriesComponent, SubCategoriesComponent, 
    CountriesComponent, CitiesComponent, CountryCityComponent, TagsComponent, MiddleSectionComponent, 
    ContentSectionComponent, BasicInfoComponent, RewardsComponent, InvestorFormComponent, 
    CreatorsFormComponent, AddInvestorFieldComponent, EditInvestorFieldComponent, AddCreatorFieldComponent, EditCreatorFieldComponent, CreatorHandbookComponent, RequestBackProjectComponent, RecommendedProjectsComponent, ContactUsComponent, HandbookComponent, AddHandbookComponent, EditHandbookComponent, SpecialServicesComponent, SubscribersComponent, SpecialRequestsComponent, CareerComponent, JobsComponent, ProjectReportsComponent, LikedProjectsComponent, NotificationsComponent, RolesComponent, PermissionComponent, AdminUsersComponent, BillGenerationComponent, InvoicePreviewComponent, CommissionChargesComponent, AddNewBillComponent, EditNewBillComponent, TemplateComponent, SmsCampaignComponent, NewsletterViewComponent, CreateProjectComponent, BasicsComponent, StoryComponent, PaymentComponent, PromotionComponent, ProjectConentComponent, RewardContentComponent, FirstTabContentComponent, SecondTabContentComponent, ThirdTabContentComponent, FourthTabContentComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
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
    TablesModule,
    WidgetModule,
    NgxSpinnerModule,
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
