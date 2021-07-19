import { Component, OnInit, ViewChildren, QueryList,PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';

import { AdvancedSortableDirective, SortEvent,SortDirection } from '../services/advanced-sortable.directive';

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.scss'],
  providers: [DecimalPipe]
})

export class InvestorsComponent implements OnInit {
 // bread crum data
 breadCrumbItems: Array<{}>;
 updateInvestor: FormGroup;
 _user_ID_ : any;

 getuserList: any=[];
 getfieldList: any=[];
 fieldata:any;
 fieldId:any;
 userFiedld :any;
 userFeed: any;
 filedid:any;
 datalist:any;
 new_arr: any=[];
 values:any;
 abc: any=[];
 searchTerm;
 controlName: string;

 accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');


      
 @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

 constructor(private pipe: DecimalPipe,
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,) {

 }


 ngOnInit() {

   this.breadCrumbItems = [{ label: 'Invesors List', active: true }];

   const formGroup = {};

    this.abc.forEach(formControl => {
      formGroup[formControl.controlName] = new FormControl('');
   });

   this.updateInvestor = new FormGroup(formGroup);


   this._fetchData();
 }

 

 _fetchData() {

  let params = {
    url: "admin/getInvestorList",
  }  
  this.apiCall.userGetService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
      this.getfieldList = resu.fields;
      this.getuserList = resu.data;
      this.getuserList.forEach(element => {
        element['isEdit'] = false;
      });
      const field_name = this.getfieldList.map((it)=>{
        return it.fieldId
      })

      this.abc = this.getuserList.map((item)=>{
        const a = {}
        field_name.forEach((f)=>{
          a[f] = item[f]

        })
        return item = a
      })

      // console.log("abc",this.abc)

    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });


 }

 getData(item) {
  return Object.keys(item);
}

getTableData(data){
  console.log("fef",data)
  data.isEdit = true;


  //  this._user_ID_ = data['_id'] 

  this.updateInvestor   = this.formBuilder.group({
   fullName: [data['fullName']],
   userName: [data['userName']],
   email: [data['email']],
   mobileNumber: [data['mobileNumber']],
   country: [data['country']],
   city: [data['city']],
   street: [data['street']],
   dob: [data['dob'], ],
   _send_me_newsletter_: [data['_send_me_newsletter_']],
   _is_admin_arroved_: [data['_is_admin_arroved_']],
   _is_mobile_verified_: [data['_is_mobile_verified_']],
   _userRole_: [data['_userRole_']],
   _user_ID_: [data['_id']],
 })


}

close(data){
  data.isEdit = false;
 }

 onSubmit(){
   
  const postData = this.updateInvestor.value
  postData['updatedby'] = this.updatedby;
  postData['userType'] = "admin";
  postData['role'] = this.role;
  // postData['_user_ID_'] = '60daa9b4547aa766315e0857';

  var params = {
    url: 'admin/updateUserDetails',
    data: postData
  }
console.log("daa",params)

this.apiCall.commonPutService(params).subscribe(
  (response: any) => {
    if (response.body.error == false) {
      // Success
      this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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

 onChangeStatus(id,status,news){
   const data = {}
  data['_user_ID_'] = id
  data['updatedby'] = this.updatedby;
  data['userType'] = "admin";
  data['role'] = this.role;
  data['_userRole_'] = "investor";
  data['_is_admin_arroved_'] = status;
  data['_send_me_newsletter_'] = news;

  var params = {
    url: 'admin/changeInvestorStatus',
    data: data
  }
  console.log("fef",params)
  this.apiCall.commonPutService(params).subscribe(
    (response: any) => {
      if (response.body.error == false) {
        // Success
        this.apiCall.showToast('Status Updated Successfully', 'Success', 'successToastr')
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


}

