import { Component, OnInit } from "@angular/core";
import { ApiCallService } from "../../services/api-call.service";
import * as XLSX from "xlsx";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: "app-model-related-report",
  templateUrl: "./model-related-report.component.html",
  styleUrls: ["./model-related-report.component.scss"],
})
export class ModelRelatedReportComponent implements OnInit {
  allorNothingData = [];
  showAccept = true;
  Payments: any;
  fileName = "BusinessModelReport.xlsx";
  searchTerm;

  constructor(private apiCall: ApiCallService, private modalService: NgbModal,) {}

  ngOnInit(): void {
    this.callRolePermission();
  }

  callRolePermission() {
    if (sessionStorage.getItem("adminRole") !== "s_a_r") {
      let contentPermssion = JSON.parse(sessionStorage.getItem("permission"));
      this.showAccept = contentPermssion[7].write;
      // console.log("prer", contentPermssion[7])
    }
  }

  previewOpen(param: any, result: any) {
    this.Payments = result
    this.modalService.open(param, { centered: true, backdrop: true, size: 'xl' });
  }

  modelRelatedGetApi(value, arch) {
    if (value == "allOrNothing") {
      let params = {
        url: "admin/getProjectReport_AON_Live",
      };
      this.apiCall.commonGetService(params).subscribe(
        (result: any) => {
          let resu = result.body;
          if (resu.error == false) {
            this.allorNothingData = resu.data;
          } else {
            this.apiCall.showToast(resu.message, "Error", "errorToastr");
          }
        },
        (error) => {
          console.error(error);
        }
      );
    } else if (value == "keepItAll") {
      let params = {
        url: "admin/getProjectReport_KIA_Live",
      };
      this.apiCall.commonGetService(params).subscribe(
        (result: any) => {
          let resu = result.body;
          if (resu.error == false) {
            this.allorNothingData = resu.data;
          } else {
            this.apiCall.showToast(resu.message, "Error", "errorToastr");
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }

    if (arch == "AONarchieve") {
      let params = {
        url: "admin/getProjectReport_AON",
      };
      this.apiCall.commonGetService(params).subscribe(
        (result: any) => {
          let resu = result.body;
          if (resu.error == false) {
            this.allorNothingData = resu.data;
          } else {
            this.apiCall.showToast(resu.message, "Error", "errorToastr");
          }
        },
        (error) => {
          console.error(error);
        }
      );
    } else if (arch == "KIParchieve") {
      let params = {
        url: "admin/getProjectReport_KIA",
      };
      this.apiCall.commonGetService(params).subscribe(
        (result: any) => {
          let resu = result.body;
          if (resu.error == false) {
            this.allorNothingData = resu.data;
            console.log("data", this.allorNothingData);
          } else {
            this.apiCall.showToast(resu.message, "Error", "errorToastr");
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  exportexcel(): void {
    if (this.allorNothingData.length > 0) {
      /* pass here the table id */
      let element = document.getElementById("excel-table");
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      XLSX.writeFile(wb, this.fileName);
    } else {
      this.apiCall.showToast("No Data Found", "Error", "errorToastr");
    }
  }
}
