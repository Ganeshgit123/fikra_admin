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
 countryList:any = [];
 cityList:any = [];
 accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');


 constructor(
  private apiCall: ApiCallService,) {
 }


 ngOnInit() {

   this.breadCrumbItems = [{ label: 'Backers List', active: true }];

   this.callRolePermission();
   this.fetchCountryList();

   const object = {country: '',}
   this._fetchData(object)
 }

 callRolePermission(){
  if(sessionStorage.getItem('adminRole') !== 's_a_r'){
    let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
    this.showAccept = settingPermssion[1].write
    // console.log("prer", settingPermssion[1])
  }
}

fetchCountryList(){
  let params = {
    url: "admin/getAllCountryWithCity",
  }  
  this.apiCall.smallGetService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
      this.countryList = resu.data;

      this.countryList.forEach(element => {
           this.cityList = element.city;
      });
      console.log("ll",this.cityList)
    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });
}

onChangeFilter(value,type){
  if(type == 'country'){
    const object = { country: value,city: "",dob:"" }
    this._fetchData(object)
  }
  if(type == 'city'){
    const object = { country:"",city: value,dob:"" }
    this._fetchData(object)
  }
  if(type == 'year'){
    const object = {country:"",city: "", dob: value }
    this._fetchData(object)
  }
}

 _fetchData(object) {
   
  object['createdBy'] = this.updatedby;
  object['userType'] = "admin";
  object['role'] = this.role;

  let params = {
    url: "admin/getInvestorList",
    data: object
  }  
  console.log("para",params)
  this.apiCall.commonPostService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
      this.getfieldList = resu.fields;
      this.getuserList = resu.data.reverse();
      console.log("dd",this.getuserList)
      this.total = this.getuserList.length
    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });


 }

 exportList(){
  const object = {};
  object['createdBy'] = this.updatedby;
  object['userType'] = "admin";
  object['role'] = this.role;
  let params = {
    url: "admin/getInvestorList",
    data: object
  }  
  this.apiCall.commonPostService(params).subscribe((result:any)=>{
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
