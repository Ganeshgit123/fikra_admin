import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { timeStamp } from 'console';

@Component({
  selector: 'app-view-investors',
  templateUrl: './view-investors.component.html',
  styleUrls: ['./view-investors.component.scss']
})
export class ViewInvestorsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  userId: any;
  getLoginDetails = [];
  getInvestorList = [];
  getInvestorFeilds = [];
  pasDel:any;

 constructor(private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Backers' },{ label: 'Backers Details', active: true }];
    this.route.params.subscribe(params => this.userId = params.id);
    this._fetchData();
    this._fetchFieldData();
    this.fetchLoginHist();

  }


  _fetchData() {

    let params = {
      url: "admin/getUserDetailsById",
      userId : this.userId,userRole: "investor",
    }  
    this.apiCall.userGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.getInvestorList = resu.data;

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  
  
   }

   _fetchFieldData(){
    let params = {
      url: "admin/getUserProfileCreationField",
    };
    this.apiCall.commonGetService(params).subscribe(
      (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          this.getInvestorFeilds = resu.data;

          const removeItinerary = (removeId) => {
            const res = this.getInvestorFeilds.filter(obj => obj.fieldId !== removeId);
            return res;
          }
          
          this.pasDel = removeItinerary('password')
           
          this.pasDel.pop();

          // console.log("eff",this.pasDel)
    
        } else {
          this.apiCall.showToast(resu.message, "Error", "errorToastr");
        }
      },
      (error) => {
        console.error(error);
      }
    );
   }


 fetchLoginHist(){
  let params = {
    url: "admin/getUserHistoryByID",
    user_Id : this.userId,
  }  
  this.apiCall.smallGetService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
      this.getLoginDetails = resu.data; 

    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });
}

}
