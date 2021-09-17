import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-bank-account-lists',
  templateUrl: './bank-account-lists.component.html',
  styleUrls: ['./bank-account-lists.component.scss']
})
export class BankAccountListsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  searchTerm;
  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  getRequestList =[];
  showAccept = true;

  constructor(
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,) {
 }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Requests List', active: true }];

    this._fetchData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let creatorPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = creatorPermssion[2].write
      // console.log("prer", creatorPermssion[2])
    }
  }

  _fetchData() {

    let params = {
      url: "admin/getRequestedBank",
    }  
    this.apiCall.userGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.getRequestList = resu.data;
      // console.log("fetch",this.getCreateList)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  
   }

   onBankVerficationStatus(values:any,val){

    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['userId'] = val;
     object['_is_Bank_Account_Verifyed_'] = visible;
     object['updatedby'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/adminApproveBank',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast("Changed Successfully", 'Success', 'successToastr')
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
