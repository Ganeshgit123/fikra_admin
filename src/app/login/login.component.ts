import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  errorMessge: string;
  isShow = false;
  lat : any;
  lng : any;
 
  constructor(
    private formBuilder: FormBuilder,
     private route: ActivatedRoute,
      private router: Router,
      private apiCall: ApiCallService
      ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
    if (sessionStorage.getItem('access_token')) {
      console.log(sessionStorage.getItem('access_token'))
      this.router.navigateByUrl(this.returnUrl);
    }

     
    this.getPosition().subscribe(pos => {
      this.lat = pos.coords.latitude
      this.lng = pos.coords.longitude
      // console.log("lat",this.lat);
      // console.log("lng",this.lng);
   });


    this.loginForm = this.formBuilder.group({
      adminName: ['',  [Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)]],
      password: ['',  [Validators.required, Validators.minLength(6),Validators.maxLength(15)]],
    });
   
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

  

  changeText(){
    this.isShow = false;
  }


  /**
   * Form submit
   */
  onSubmit() {

    this.submitted = true;

    // console.log("form",this.loginForm)

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return false;
    } 

    this.loginForm.value.lat = this.lat
    this.loginForm.value.lang = this.lng
    this.isShow = false;
    this.apiCall.adminLogin(this.loginForm.value).subscribe(
     res => {
       if(res.body['error'] == false){
         sessionStorage.setItem('access_token', (res.body['token']));
         sessionStorage.setItem('adminRole', (res.body['role']))
         sessionStorage.setItem('adminId', (res.body['adminId']))
         this.router.navigateByUrl('/dashboard');
       } else {
         this.isShow = true;
         this.errorMessge = res.body['message'];
       }
       
     })
  }

}
