import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  financialData = [];
  walletData = [];
  specialReqData = [];
  specialArchieve = false;
  archieveSpecialData = [];

  constructor(private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Reports' },{ label: 'Lists', active: true }];

    this.specialRequestReport();
    this.financialReport();
    this.walletReport();
  }

  specialRequestReport(){
    let params = {
      url: "admin/getSpecialRequestReport",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this. specialReqData = resu.data; 
  
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onChangeClosedStatus(id,val){
    const object = {};
    object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;
    object['requestId'] = id
    if(val == "closed"){
    object['_isArchived_'] = true
    }else{
    object['_isArchived_'] = false
    }

    var params = {
      url: 'admin/updateSpecialRequestStatus',
      data: object
    }
// console.log("ddd",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {

          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.ngOnInit();
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

  archiveSpecialReport(){
    this.specialArchieve = true;
    let params = {
      url: "admin/getArchivedSpecialRequest",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.archieveSpecialData = resu.data; 
  
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  financialReport(){
    let params = {
      url: "admin/getFikraFinancialReport",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.financialData = resu.data; 
  
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  walletReport(){
    let params = {
      url: "admin/getWalletReport",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this. walletData = resu.data; 
  
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }



}
