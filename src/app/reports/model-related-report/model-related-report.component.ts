import { Component, OnInit } from "@angular/core";
import { ApiCallService } from "../../services/api-call.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import { DatePipe } from '@angular/common'


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
  dataTotal;
  page = 1;
  modelcsvOptions: any;

  constructor(private apiCall: ApiCallService, private modalService: NgbModal
    , private datePipe: DatePipe) { }

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
            this.dataTotal = this.allorNothingData.length
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
            this.dataTotal = this.allorNothingData.length
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
            this.dataTotal = this.allorNothingData.length
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
            this.dataTotal = this.allorNothingData.length

            // console.log("data", this.allorNothingData);
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

  exportexcel(event) {
    if (this.allorNothingData.length > 0) {
      this.exportModelData(this.allorNothingData)
    } else {
      this.apiCall.showToast("No Data Found", 'Error', 'errorToastr')
    }

  }

  exportModelData(data) {
    if (data.length > 0) {
      var bulkArray = []

      data.forEach(element => {
        var obj = {}
        obj['Project Id'] = element.projectId
        obj['creatorName'] = element.creatorName
        obj['lunchedDate'] = element.lunchedDate;
        obj['endDate'] = this.datePipe.transform(element.endDate, 'MMM d, y');
        obj['projectStatus'] = element.projectStatus
        obj['goalAmount'] = element.goalAmount
        obj['fundedAmount'] = element.fundedAmount
        obj['fundedPerc'] = element.fundedPerc
        obj['noOfPledge'] = element.noOfPledge
        obj['bussinesModel'] = element.bussinesModel
        obj['noOfSuccessPledge'] = element.noOfSuccessPledge
        obj['unProcessedAmount'] = element.unProcessedAmount  
        obj['noOfUnsuccessfullPledge'] = element.noOfUnsuccessfullPledge  
        obj['totalAmountRecived'] = element.totalAmountRecived  
        obj['percOfUnsuccessProcessedPayment'] = element.percOfUnsuccessProcessedPayment  
        obj['totalVatAmount'] = element.totalVatAmount  
        obj['totalProcssingFee'] = element.totalProcssingFee  
        obj['fikraCommission'] = element.fikraCommission  
        obj['creatorAmount'] = element.creatorAmount  
        obj['paymentMethod'] =  element.pledgedPayment

        // console.log("o000",element.pledgedPayment)

        // element.pledgedPayment.forEach(elementss => {
        //   var ssobj = {}
        //   ssobj['dateRecived'] = elementss.dateRecived
        //   pledgeArr.push(ssobj['dateRecived'])

        // })

        console.log("dd",  obj)

        bulkArray.push(obj)
      })

      this.modelcsvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Business Model Report',
        useBom: true,
        noDownload: false,
        headers: ["Project Id", "Creator Name", "Launch Date", "End Date", "Project Status", "Goal Amount", "Funded Amount", "% funded", 
        "No of Pledges", "Business Model","Successful No of Pledges Processed","Unprocessed Amount","No of Unsuccessful Pledges","Total Amount Received",
      "% of unsuccessful Processed Payments", "Total VAT","Total Processing Fees","Fikra Commission","Creator Amount","Payment Method","Successful Payment Received",
    "VAT Amount","Processing Fees","Date Received"]
      };
      new AngularCsv(bulkArray, "Business Model Report", this.modelcsvOptions);

    }
  }
}
