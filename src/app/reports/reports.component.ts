import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import * as XLSX from 'xlsx';

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
  showAccept = true;
  fileName = 'specialRequestReport.xlsx';
  fileName1 = 'specialRequestArchieveReport.xlsx';
  wallReportName = 'walletReport.xlsx';
  financialReportName = 'financialReport.xlsx';
  searchTerm;
  page = 1;
  specialReqDataTotal:any;
  speicalArchieveSearch;
  walletSearch;
  finacialSearch;
  
  constructor(private apiCall: ApiCallService,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Reports' }, { label: 'Lists', active: true }];
    this.callRolePermission();
  }

  callRolePermission() {
    if (sessionStorage.getItem('adminRole') !== 's_a_r') {
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[7].write
      // console.log("prer", contentPermssion[7])
    }
  }

  specialRequestReport() {
    let params = {
      url: "admin/getSpecialRequestReport",
    }
    this.apiCall.commonGetService(params).subscribe((result: any) => {
      let resu = result.body;
      if (resu.error == false) {
        this.specialReqData = resu.data;
        this.specialReqDataTotal = this.specialReqData.length
      } else {
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    }, (error) => {
      console.error(error);

    });
  }

  onChangeClosedStatus(id, val) {
    const object = {};
    object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;
    object['requestId'] = id
    if (val == "closed") {
      object['_isArchived_'] = true
    } else {
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

  archiveSpecialReport() {
    this.specialArchieve = true;
    let params = {
      url: "admin/getArchivedSpecialRequest",
    }
    this.apiCall.commonGetService(params).subscribe((result: any) => {
      let resu = result.body;
      if (resu.error == false) {
        this.archieveSpecialData = resu.data;

      } else {
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    }, (error) => {
      console.error(error);

    });
  }

  financialReport() {
    let params = {
      url: "admin/getFikraFinancialReport",
    }
    this.apiCall.commonGetService(params).subscribe((result: any) => {
      let resu = result.body;
      if (resu.error == false) {
        this.financialData = resu.data;

      } else {
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    }, (error) => {
      console.error(error);

    });
  }

  walletReport() {
    let params = {
      url: "admin/getWalletReport",
    }
    this.apiCall.commonGetService(params).subscribe((result: any) => {
      let resu = result.body;
      if (resu.error == false) {
        this.walletData = resu.data;

      } else {
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    }, (error) => {
      console.error(error);

    });
  }

  specialNormalExport(): void {

    if (this.specialReqData.length > 0) {
      let element = document.getElementById('specialReqReport');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, this.fileName);

    } else {
      this.apiCall.showToast("No Data Found", 'Error', 'errorToastr')
    }
  }

  specialArchieveExport(): void {

    if (this.archieveSpecialData.length > 0) {
      let element = document.getElementById('specialArchieveReqTable');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, this.fileName1);

    } else {
      this.apiCall.showToast("No Data Found", 'Error', 'errorToastr')
    }
  }

  walletReportExp(): void {

    if (this.archieveSpecialData.length > 0) {
      let element = document.getElementById('walletRepTable');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, this.wallReportName);

    } else {
      this.apiCall.showToast("No Data Found", 'Error', 'errorToastr')
    }
  }

  financiExpoReprt(): void {
    if (this.financialData.length > 0) {
      let element = document.getElementById('financExpoTable');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, this.financialReportName);

    } else {
      this.apiCall.showToast("No Data Found", 'Error', 'errorToastr')
    }
  }

  
}
