import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { LanguageService } from '../../../core/services/language.service';
import { ApiCallService } from '../../../services/api-call.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  element: any;
  configData: any;
  cookieValue;
  flagvalue;
  countryName;
  valueset: string;
  notificationData: any;
  updatedby: any;
  role: any;
  adminName:any;
  adminEmail:any;
  sessionNotiData:any;
  lat : any;
  lng : any;
  intervalId:any;
  
  // tslint:disable-next-line: max-line-length
  constructor(@Inject(DOCUMENT) private document: any, private router: Router, public languageService: LanguageService, public cookiesService: CookieService,
    private apiCall: ApiCallService,) { }

  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');
    this.adminName = sessionStorage.getItem('adminName');
    this.adminEmail = sessionStorage.getItem('adminEmail');
    this.element = document.documentElement;
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    };

    this.cookieValue = this.cookiesService.get('lang');
    // if (val.length === 0) {
    //   if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    // } else {
    //   this.flagvalue = val.map(element => element.flag);
    // }

    this.getPosition().subscribe(pos => {
      this.lat = pos.coords.latitude
      this.lng = pos.coords.longitude
      // console.log("lat",this.lat);
      // console.log("lng",this.lng);
   });

  this.intervalId = setInterval(() => {
      this.fetchSessionNotifyData();
  }, 5000);

  this.fetchNotificationData();

  }

  fetchNotificationData() {
    let params = {
      url: "admin/getNotificationAdmin",
    }
    this.apiCall.commonGetService(params).subscribe((result: any) => {
      let resu = result.body;
      if (resu.error == false) {
        this.notificationData = resu.notification;
        // console.log("data", this.notificationData)

      } else {
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    }, (error) => {
      console.error(error);

    });
  }

  visitedStatus(val) {

    const object = {}

    object['notificationId'] = val;
    object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

    var params = {
      url: 'admin/isVisitedNotificationAdmin',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast("Visited Successfully", 'Success', 'successToastr')
          this.ngOnInit();
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )
  }

  onDeleteNotification(id) {
    const object = {}

    object['notificationId'] = id;
    object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

    var params = {
      url: 'admin/deleteNotificationAdmin',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast("Deleted Successfully", 'Success', 'successToastr')
          this.ngOnInit();
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )
  }

  fetchSessionNotifyData(){
    let params = {
      url: "admin/getSesstionAdmin",
    }
    this.apiCall.commonGetService(params).subscribe((result: any) => {
      let resu = result.body;
      if (resu.error == false) {
        this.sessionNotiData = resu.notification;  
      } else {
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
        if(resu.error.msg == 'jwt expired' || resu.error.msg == 'Your token has been expired'){
          this.apiCall.showToast("Session Expired", 'Success', 'successToastr')
          sessionStorage.clear();
          this.router.navigate(['/']);
        } 
      }
    }, (error) => {
      
      console.error(error);
    });
  }
  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }



  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  /**
   * Translate language
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

    getPosition(): Observable<any> {
      return Observable.create(observer => {
        window.navigator.geolocation.getCurrentPosition(position => {
          observer.next(position);
          observer.complete();
        },
          error => observer.error(error));
      });
  }


  /**
   * Logout the user
   */
  logout() {

    const object = {}

    object['lat'] = this.lat;
    object['lang'] = this.lng;

    var params = {
      url: 'admin/adminloginOut',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast("Logout Successfully", 'Success', 'successToastr')
          clearInterval(this.intervalId);
          sessionStorage.clear();
          this.router.navigate(['/']);
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        console.log('Error', error)
      }
    )

  }
}
