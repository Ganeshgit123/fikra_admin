import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: FormBuilder,
     private route: ActivatedRoute,
      private router: Router,
      private apiCall: ApiCallService
      ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (sessionStorage.getItem('access_token')) {
      console.log(sessionStorage.getItem('access_token'))
      this.router.navigateByUrl(this.returnUrl);
    }
    this.loginForm = this.formBuilder.group({
      adminName: ['',  [Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/)]],
      password: ['',  [Validators.required, Validators.minLength(6),Validators.maxLength(15)]]
    });
    }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  changeText(){
    this.isShow = false;
  }
  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } 
    this.isShow = false;
    this.apiCall.adminLogin(this.loginForm.value).subscribe(
     res => {
       if(res.body['error'] == "false"){
         sessionStorage.setItem('access_token', (res.body['data'].token));
         sessionStorage.setItem('adminRole', (res.body['data'].info.role))
         sessionStorage.setItem('permission', (JSON.stringify(res.body['data'].permission)))
         this.router.navigateByUrl('/');
       } else {
         this.isShow = true;
         this.errorMessge = res.body['message'];
       }
       
     })
  }

}
