import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from '../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  showPassword = false;
  showModalPassword = false;
  input: any;
  logOutForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
     private route: ActivatedRoute,
      private router: Router,
      private apiCall: ApiCallService,
      private modalService: NgbModal
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

    this.logOutForm = this.formBuilder.group({
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
      (res: any) => {
       if(res.body.error == false){
         sessionStorage.setItem('access_token', (res.body.token));
         sessionStorage.setItem('adminId', (res.body.adminId));
         sessionStorage.setItem('adminEmail', (res.body.email));
         sessionStorage.setItem('isTimeBasedWirte', (res.body.isTimeBasedWrite));
         sessionStorage.setItem('canWrite', (res.body.canWrite));

         if(res.body.role == 's_a_r' ){
          sessionStorage.setItem('adminRole', (res.body.role));
         }else{
          sessionStorage.setItem('adminName', (res.body.name));
          sessionStorage.setItem('adminRole', (res.body.role.roleName));
          sessionStorage.setItem('permission', (JSON.stringify(res.body.role.permission)))
         }
         this.modalService.dismissAll();
         this.router.navigateByUrl('/dashboard');
       } else {
         this.isShow = true;
         this.errorMessge = res.body.message;
        }
     })
  }

    openModal(logoutModalOpen){
      this.modalService.open(logoutModalOpen, { centered: true });
  }


  onLogoutSubmit(){

    this.submitted = true;


    // stop here if form is invalid
    if (this.logOutForm.invalid) {
      return false;
    } 
    const postData = this.logOutForm.value;
    this.logOutForm.value.lat = this.lat
    this.logOutForm.value.lang = this.lng

    var params1 = {
      url: 'admin/adminloginOutAll',
      data: postData
    }
    console.log("dd",params1)
  this.apiCall.commonLogoutService(params1).subscribe(
    (response: any) => {
    if (response.body.error == false) {
    
    this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
    this.modalService.dismissAll();
    window.location.reload();
    } else {
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
