import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  searchTerm;
  getReqList: any=[];

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');

  constructor(
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,) {

 }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Creator Request List', active: true }];

    this._fetchData();

  }

  _fetchData() {

    let params = {
      url: "admin/getCreatorRequestedList",
    }  
    this.apiCall.userGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.getReqList = resu.data;
      // console.log("fetch",this.getReqList)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  
   }

   onChangeCreatorStatus(id,status){

    if(status === 'Approved'){
       var stat = true
    }
    // console.log("dfe",stat,id)
    const data = {}
   data['userId'] = id
   data['updatedby'] = this.updatedby;
   data['userType'] = "admin";
   data['role'] = this.role;
   data['_is_admin_arroved_'] = stat;
   data['_is_deleted_'] = false;

   var params = {
     url: 'admin/changeCreatorStatus',
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

  deleteRequest(id,approve,deleteStat){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#ff3d60',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
    // console.log("fef",id,approve,deleteStat)
    if(deleteStat === false){
      var stat = true
   }
   // console.log("dfe",stat,id)
   const data = {}
  data['userId'] = id
  data['updatedby'] = this.updatedby;
  data['userType'] = "admin";
  data['role'] = this.role;
  data['_is_admin_arroved_'] = approve;
  data['_is_deleted_'] = stat;

  var params = {
    url: 'admin/changeCreatorStatus',
    data: data
  }
  // console.log("fef",params)
  this.apiCall.commonPutService(params).subscribe(
    (response: any) => {
      if (response.body.error == false) {
        // Success
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        // this.apiCall.showToast('Status Updated Successfully', 'Success', 'successToastr')
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
    });

  }
  
}
