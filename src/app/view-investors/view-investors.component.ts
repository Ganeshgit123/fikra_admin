import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-investors',
  templateUrl: './view-investors.component.html',
  styleUrls: ['./view-investors.component.scss']
})
export class ViewInvestorsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  getuserList: any=[];
  getfieldList: any=[];
  userId: number;

  
 constructor(private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  ) {
    
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Investors' },{ label: 'Investor Details', active: true }];
    this.route.params.subscribe(params => this.userId = params.id);
    this._fetchData();
    // this.fetchLoginHist();

  }

  _fetchData() {

    let params = {
      url: "admin/getUserDetailsById",
    }  
    this.apiCall.userGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.getuserList = resu.data;
         console.log("user",this.getuserList)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  
  
   }


//  fetchLoginHist(){
//   let params = {
//     url: "admin/getInvestorList",
//   }  
//   this.apiCall.userGetService(params).subscribe((result:any)=>{
//     let resu = result.body;
//     if(resu.error == false)
//     {
//       this.getuserList = resu.data; 

//     }else{
//       this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
//     }
//   },(error)=>{
//      console.error(error);
     
//   });
// }

}
