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
      url: "admin/getAllAdminApprovalRequest",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.reqData = resu.data;

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    }); 
  }


  onChangeReqStatus(id,status){
    const object = {}

    object['requestId'] = id;
    object['status'] = status;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/adminStatusApprove',
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
