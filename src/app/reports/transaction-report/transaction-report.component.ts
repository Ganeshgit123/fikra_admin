import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.scss']
})
export class TransactionReportComponent implements OnInit {
  transactionRelData = [];
  archievedFiniceData = [];
  archieve = false;
  showAccept = true;

  constructor(private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[7].write
      // console.log("prer", contentPermssion[7])
    }
  }

  transactionGetApiCall(value){
    let params = {
          url: "admin/getTransactionAdminReport",
          model : value
        }  
        this.apiCall.reportModelGetService(params).subscribe((result:any)=>{
          let resu = result.body;
          if(resu.error == false)
          {
    
          this.transactionRelData = resu.data;
    
          }else{
            this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
            this.ngOnInit();
          }
        },(error)=>{
           console.error(error);
           
        }); 

        if(value == 'archieved'){
          this.archieve = true;
          let params = {
                url: "admin/getArchivedTransactionAdmin",
              }  
              this.apiCall.commonGetService(params).subscribe((result:any)=>{
                let resu = result.body;
                if(resu.error == false)
                {
                  this.archievedFiniceData = resu.data; 
            
                }else{
                  this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
                }
              },(error)=>{
                 console.error(error);
                 
              });
        }
      }


}
