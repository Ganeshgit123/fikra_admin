import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
@Component({
  selector: 'app-change-request-user',
  templateUrl: './change-request-user.component.html',
  styleUrls: ['./change-request-user.component.scss']
})
export class ChangeRequestUserComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  searchTerm;
  updatedby:any;
  role:any;

  reqData = [];
  page = 1;
  total: any;

  constructor(
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,) {

 }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Write permission Request List', active: true }];
  this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.fetchRequestData();
  }

  fetchRequestData(){
    let params = {
      url: "admin/getAllChangeRequestForSuperAdmin",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.reqData = resu.data;
        this.total = this.reqData.length
       
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    }); 
  }


  onChangeReqStatus(vals,status){

     var reqId = vals['_id'] 

    if(status == 'approved'){
      var adminApprove = true
      var adminReject = false
    }else if(status == 'rejected'){
      var adminApprove = false
      var adminReject = true
    }

    if(adminApprove == true){
       var apiUrl = vals['APIURL']
       var pamData = vals['paramsForAPI'
      ]
       var newParams = {...pamData[0]}

       newParams['createdBy'] = this.updatedby;
       newParams['userType'] = "admin";
       newParams['role'] = this.role;
       delete(newParams['_id'])
      var params = {
        url: apiUrl,
        data: newParams
      }
      // console.log("par",params)
      this.apiCall.roleBasedPostService(params).subscribe(
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
    const object = {}

    object['requestId'] = reqId;
    object['_is_Admin_Approved_'] = adminApprove;
    object['_is_Admin_Rejected_'] = adminReject;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params1 = {
     url: 'admin/statusUpdateForRequest',
     data: object
   }
  //  console.log("2ndparms",params1)
   this.apiCall.commonPostService(params1).subscribe(
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
