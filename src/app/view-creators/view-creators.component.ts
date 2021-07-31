import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-creators',
  templateUrl: './view-creators.component.html',
  styleUrls: ['./view-creators.component.scss']
})
export class ViewCreatorsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  getuserList: any=[];
  userId: any;
  temp = [];
  getCreatorList = [];

   constructor(private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Creators' },{ label: 'Creator Details', active: true }];
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
