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

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { TablesModule } from './tables/tables.module';
import { ProjectsComponent } from './projects/projects.component';
import { InvestorsComponent } from './investors/investors.component';
import { CreatorsComponent } from './creators/creators.component';
import { LoginComponent } from './login/login.component';
import { FieldeditComponent } from './fieldedit/fieldedit.component';
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
import { InvestorFieldComponent } from './fieldedit/investor-field/investor-field.component';
import { CreatorFieldComponent } from './fieldedit/creator-field/creator-field.component';
import { ProjectsFieldComponent } from './fieldedit/projects-field/projects-field.component';
import { ViewInvestorsComponent } from './view-investors/view-investors.component';
import { FaqComponent } from './faq/faq.component';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
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
    FieldeditComponent, PrivacyPolicyComponent, CookiePolicyComponent, TermsOfUseComponent, 
    UserHomePageComponent, AboutPageComponent, SettingsComponent, CategorySubCategoryComponent, 
    StartAProjectComponent, NewsletterContentComponent, BannerComponent, FeaturedTakingoffComponent,
    CreatorsCornerComponent, ClientLogosComponent, FooterContentComponent, InvestorFieldComponent, 
    CreatorFieldComponent, ProjectsFieldComponent, ViewInvestorsComponent, FaqComponent, RequestListComponent, 
    RequestDetailsComponent, ViewProjectsComponent, StartBannerComponent, QuoteComponent, ProjectQComponent, 
    VideoSectionComponent, WhyFikraComponent, ViewCreatorsComponent, CategoriesComponent, SubCategoriesComponent, 
    CountriesComponent, CitiesComponent, CountryCityComponent, TagsComponent, MiddleSectionComponent, ContentSectionComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutsModule,
    UiModule,
    CKEditorModule,
    Ng2SearchPipeModule,
    NgbNavModule,
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
