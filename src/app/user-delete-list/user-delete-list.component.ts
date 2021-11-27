import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-user-delete-list',
  templateUrl: './user-delete-list.component.html',
  styleUrls: ['./user-delete-list.component.scss']
})
export class UserDeleteListComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  page = 1;
  total: any;
  searchTerm;
  getDeleteReqList: any=[];
  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  constructor(
    private apiCall: ApiCallService,) {
   }

   ngOnInit() {

   this.breadCrumbItems = [{ label: 'Users List', active: true }];

   this._fetchData();
 }

 _fetchData() {

  let params = {
    url: "admin/getAllDeletedRequest",
  }  
  this.apiCall.commonGetService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
      this.getDeleteReqList = resu.data;
      console.log("dd",this.getDeleteReqList)
      this.total = this.getDeleteReqList.length
    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });
 }

 deleteReqUser(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#34c38f",
    cancelButtonColor: "#ff3d60",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.value) {
      console.log("id", id);
      const data = {};
      data["requestId"] = id;
      data["createdBy"] = this.updatedby;
      data["userType"] = "admin";
      data["role"] = this.role;

      var params = {
        url: "admin/deleteUserAccountById",
        data: data,
      };
      // console.log("fef",params)
      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
          if (response.body.error == false) {
            // Success
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            // this.apiCall.showToast('Status Updated Successfully', 'Success', 'successToastr')
            this.ngOnInit();
          } else {
            // Query Error
            this.apiCall.showToast(
              response.body.message,
              "Error",
              "errorToastr"
            );
          }
        },
        (error) => {
          this.apiCall.showToast("Server Error !!", "Oops", "errorToastr");
          console.log("Error", error);
        }
      );
    }
  });
}

}
