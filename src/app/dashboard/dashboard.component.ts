import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';

import {ChartType} from './data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

/**
 * Dashboard Component
 */
export class DashboardComponent implements OnInit {


  constructor(public formBuilder: FormBuilder,
    private apiCall: ApiCallService,) {
  }

  // bread crumb items
  breadCrumbItems: Array<{}>;

  projectsChart: ChartType;
  usersData: ChartType;
  sparklineEarning: ChartType;
  sparklineMonthly: ChartType;

  // Form submit
  chatSubmit: boolean;

  formData: FormGroup;
  creatorCount:any;
  investorCount:any;
  projectCount:any;
  successProjCount:any;
  pledgeCount:any;
  
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Fikra' }, { label: 'Dashboard', active: true }];

    this.countData();
    this.dognutData();
    this.projectsMonth();
  }



  countData(){
    let params = {
      url: "admin/getAdminDashboardContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.creatorCount = resu.data.creatorCount;
        this.investorCount = resu.data.investorCount;
        this.projectCount = resu.data.projectCount;
        this.successProjCount = resu.data.successProjectCount;
        this.pledgeCount = resu.data.pledgesCount;
                  
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    }); 
  }

  dognutData(){
    
    this.usersData = {
      
      series: [18, 9],

      chart: {
          height: 230,
          type: 'donut',
      },
      
      labels: ['No. of Creators', 'No. of Investors'],
      plotOptions: {
          pie: {
              donut: {
                  size: '75%'
              }
          }
      },
      dataLabels: {
          enabled: false
      },
      legend: {
          show: false,
      },
      colors: ['#FF594E', '#1cbb8c',],
      
  };
  }
   
  projectsMonth(){
    this.projectsChart = {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            endingShape: 'rounded',
            columnWidth: '45%',
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    colors: ['#5664d2'],
    series: [{
        name: 'Successfull Projects',
        data: [46, 57, 59, 54, 62, 58, 64, 60, 66,90,10,20]
    }],
    xaxis: {
        categories: ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov','Dec'],
    },
    yaxis: {
        title: {
            text: 'numbers'
        }
    },
    fill: {
        opacity: 1
    },
    grid: {
        borderColor: '#f1f1f1'
    },
    tooltip: {
        // y: {
        //     formatter: (val) => {
        //         return '$ ' + val + ' thousands';
        //     }
        // }
    }
  
  }
}
  

}
