import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiCallService } from "../services/api-call.service";

import { ChartType } from "./data";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})

/**
 * Dashboard Component
 */
export class DashboardComponent implements OnInit {
  constructor(
    public formBuilder: FormBuilder,
    private apiCall: ApiCallService
  ) {}

  // bread crumb items
  breadCrumbItems: Array<{}>;

  projectsChart: ChartType;
  usersData: ChartType;
  sparklineEarning: ChartType;
  sparklineMonthly: ChartType;

  // Form submit
  chatSubmit: boolean;

  formData: FormGroup;
  creatorCount: any;
  investorCount: any;
  projectCount: any;
  successProjCount: any;
  pledgeCount: any;
  totVistors:any;

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Fikra" },
      { label: "Dashboard", active: true },
    ];

    this.countData();
    this.projectsMonth();

    const data = 'today'
    this.dayWiseVisitors(data)
  }

  countData() {
    let params = {
      url: "admin/getAdminDashboardContent",
    };
    this.apiCall.commonGetService(params).subscribe(
      (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          this.creatorCount = resu.data.creatorCount;
          this.investorCount = resu.data.investorCount;
          this.projectCount = resu.data.projectCount;
          this.successProjCount = resu.data.successProjectCount;
          this.pledgeCount = resu.data.pledgesCount;
          this.usersData = {
            series: [resu.data.creatorCount, resu.data.investorCount],

            chart: {
              height: 230,
              type: "donut",
            },

            labels: ["No. of Creators", "No. of Investors"],
            // plotOptions: {
            //     pie: {
            //         donut: {
            //             size: '75%'
            //         }
            //     }
            // },
            dataLabels: {
              enabled: false,
            },
            legend: {
              show: false,
            },
            colors: ["#FF594E", "#1cbb8c"],
          };
          
          this.projectsChart = {
            chart: {
              height: 350,
              type: "bar",
              toolbar: {
                show: false,
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                endingShape: "rounded",
                columnWidth: "45%",
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              show: true,
              width: 2,
              colors: ["transparent"],
            },
            colors: ["#5664d2"],
            series: [
              {
                name: "Total all or nothing",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              }
            ],
            xaxis: {
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
            yaxis: {
              title: {
                text: "numbers",
              },
            },
            fill: {
              opacity: 1,
            },
            grid: {
              borderColor: "#f1f1f1",
            },
            tooltip: {
              // y: {
              //     formatter: (val) => {
              //         return '$ ' + val + ' thousands';
              //     }
              // }
            },
          };
        } else {
          this.apiCall.showToast(resu.message, "Error", "errorToastr");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  async projectsMonth() {
    let allOr = {
      name: "Total all or nothing",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
    let keepIt = {
      name: "Total keep it all",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
    let total = {
      name: "Total amount recived",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }

    let params = {
      url: "admin/getFikraFinancialReport",
    };
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];

    this.apiCall.commonGetService(params).subscribe(
      async (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          await months.reduce(
            async (promise, element, index) => {
          //     {
          //       "year": "2021",
          //       "month": "Sep",
          //       "totalKeepitAll": 0,
          //       "totalAllorNothing": 100,
          //       "totalAmount": 1300,
          //       "totalVat": 100,
          //       "totalProcessingFee": 100
          //   },
          //   {
          //     "year": "2021",
          //     "month": "Feb",
          //     "totalKeepitAll": 50,
          //     "totalAllorNothing": 0,
          //     "totalAmount": 1300,
          //     "totalVat": 100,
          //     "totalProcessingFee": 100
          // },
              let data = resu.data.find(data => data.month == element)
              console.log(data)
              if(data != undefined){
                allOr.data[index] = data.totalAllorNothing;
                keepIt.data[index] = data.totalKeepitAll;
                total.data[index] = data.totalAmount;
              }
              await promise;
            },Promise.resolve()
          )
          console.log(keepIt)
          this.projectsChart = {
            chart: {
              height: 350,
              type: "bar",
              toolbar: {
                show: false,
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                endingShape: "rounded",
                columnWidth: "45%",
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              show: true,
              width: 2,
              colors: ["transparent"],
            },
            colors: ["#5664d2", "#505d69", '#db3700'],
            series: [
              allOr, keepIt, total
            ],
            xaxis: {
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
            },
            yaxis: {
              title: {
                text: "numbers",
              },
            },
            fill: {
              opacity: 1,
            },
            grid: {
              borderColor: "#f1f1f1",
            },
            tooltip: {
              // y: {
              //     formatter: (val) => {
              //         return '$ ' + val + ' thousands';
              //     }
              // }
            },
          };
        } else {
          this.apiCall.showToast(resu.message, "Error", "errorToastr");
        }
      },
      (error) => {
        console.error(error);
      }
    );

  }

  VisitClick(val){
    this.dayWiseVisitors(val)
  }

  dayWiseVisitors(data){
    let params = {
      url: "admin/getTodayDayVisitors",
      query : data
    }  
console.log("parms",params)
    this.apiCall.visitorGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
         console.log("res",resu.data)
        this.totVistors = resu.data.totalResults;
        console.log("permis",this.totVistors)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }
}
