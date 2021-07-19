import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  searchTerm;
  getReqList: any=[];

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');

  constructor(
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,) {

 }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Creator Request List', active: true }];

    this._fetchData();

  }

  _fetchData() {

    let params = {
      url: "admin/getCreatorRequestedList",
    }  
    this.apiCall.userGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.getReqList = resu.data;
      // console.log("fetch",this.getReqList)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  
  
   }
  
}
