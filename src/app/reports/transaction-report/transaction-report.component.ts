import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import * as XLSX from 'xlsx';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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
  fileName= 'TransactionReport.xlsx';
  fileName1= 'TransactionArchieveReport.xlsx';
  normatransSearch;
  transArchieveSearch;
  transHistory:any;
  page = 1;
  total: any;
  archieveTranstotal:any;
  archieveTransHistory:any;
  
  constructor(private apiCall: ApiCallService,
    private modalService: NgbModal,
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

  previewOpen(param: any, result: any) {
    this.transHistory = result
    this.modalService.open(param, { centered: true, backdrop: true, size: 'xl' });
  }

  archieveOpen(param: any, result: any) {
    this.archieveTransHistory = result
    this.modalService.open(param, { centered: true, backdrop: true, size: 'xl' });
  }
  

  transactionGetApiCall(value){
    if(value == 'allOrNothing' || value == 'keepItAll'){
      this.archieve = false;
     let params = {
          url: "admin/getTransactionAdminReport",
          model : value
        }  
        this.apiCall.reportModelGetService(params).subscribe((result:any)=>{
          let resu = result.body;
          if(resu.error == false)
          {
    
          this.transactionRelData = resu.data;
      this.total = this.transactionRelData.length
           
          }else{
            this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
            this.ngOnInit();
          }
        },(error)=>{
           console.error(error);
           
        }); 
      }

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
      this.archieveTranstotal = this.archievedFiniceData.length
            
                }else{
                  this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
                }
              },(error)=>{
                 console.error(error);
                 
              });
        }
      }

      normalExport(): void
      {
        if(this.transactionRelData.length > 0){
    let element = document.getElementById('normalTrans-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    XLSX.writeFile(wb, this.fileName);
    
        }else{
      this.apiCall.showToast("No Data Found", 'Error', 'errorToastr')
        }
      }

      archieveExport(): void
      {
        if(this.archievedFiniceData.length > 0){
    /* pass here the table id */
    let element = document.getElementById('archieveTrans-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    /* save to file */  
    XLSX.writeFile(wb, this.fileName1);
    
        }else{
      this.apiCall.showToast("No Data Found", 'Error', 'errorToastr')
        }
      }

}
