import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';

import { ApiCallService } from '../services/api-call.service';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.scss'],
  providers: []
})

export class InvestorsComponent implements OnInit {
 // bread crum data
 breadCrumbItems: Array<{}>;

 getuserList: any=[];
 getfieldList: any=[];
 page = 1;
 total: any;
 searchTerm;
 showAccept = true;
 investorcsvOptions: any;

 accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');


 constructor(
  private apiCall: ApiCallService,) {
 }


 ngOnInit() {

   this.breadCrumbItems = [{ label: 'Backers List', active: true }];

   this._fetchData();
   this.callRolePermission();

 }

 callRolePermission(){
  if(sessionStorage.getItem('adminRole') !== 's_a_r'){
    let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
    this.showAccept = settingPermssion[1].write
    // console.log("prer", settingPermssion[1])
  }
}

 _fetchData() {

  let params = {
    url: "admin/getInvestorList",
  }  
  this.apiCall.userGetService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
      this.getfieldList = resu.fields;
      this.getuserList = resu.data;
      // console.log("dd",this.getuserList)
      this.total = this.getuserList.length
    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });


 }

 exportList(){
  let params = {
    url: "admin/getInvestorList",
  }  
  this.apiCall.userGetService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
      this.getuserList = resu.data;
      if(resu.data.length > 0){
        this.exportInvestorMailData(resu.data)
      }
    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });
 }

 exportInvestorMailData(data){
  if(data.length > 0){
    var bulkArray = []
    data.forEach(element => {
      var obj = {}
      obj['Email Id'] = element.email

      bulkArray.push(obj)
    })

    this.investorcsvOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Investors Email Id',
      useBom: true,
      noDownload: false,
      headers: ["Email Id"]
    };
    new  AngularCsv(bulkArray, "Investors Email Id", this.investorcsvOptions);

  }
}
}
