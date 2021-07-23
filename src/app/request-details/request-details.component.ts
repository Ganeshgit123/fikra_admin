import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  getuserList: any=[];
  userId: number;
  temp = [];
  getCreatorList = [];
  
  constructor(private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Requests' },{ label: 'Creator Request Details', active: true }];
    this.route.params.subscribe(params => this.userId = params.id);
    this._fetchData();
  }

  _fetchData() {

    let params = {
      url: "admin/getUserDetailsById",
      userId : this.userId,
    }  
    this.apiCall.userGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.getuserList = resu.data;
        this.getCreatorList = resu.data.Creator_details;
 
         console.log("creator",this.getCreatorList)

     this.temp.push(this.getuserList)
        //  console.log("user",temp)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  
  
   }

}

