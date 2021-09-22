import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  financialData = [];
  walletData = [];
  specialReqData = [];

  constructor(private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Reports' },{ label: 'Lists', active: true }];
    
    this.financialReport();
    this.walletReport();
    this.specialRequestReport();
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

}
