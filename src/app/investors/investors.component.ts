import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';

import { ApiCallService } from '../services/api-call.service';


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

 accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');


 constructor(
  private apiCall: ApiCallService,) {
 }


 ngOnInit() {

   this.breadCrumbItems = [{ label: 'Invesors List', active: true }];

   this._fetchData();
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
      
      this.total = this.getuserList.length
    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });


 }

}
