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
  getField: any=[];
  userId: number;
  temp = [];
  abc: any=[];
  
 constructor(private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  ) {
    
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Investors' },{ label: 'Investor Details', active: true }];
    this.route.params.subscribe(params => this.userId = params.id);
    this._fetchData();
    // this._fetchFieldData();
    this.fetchLoginHist();

  }

  getData(item) {
    return Object.keys(item);
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
        this.getuserList = resu.data;

     this.temp.push(this.getuserList)
        //  console.log("user",temp)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  
  
   }

  //  _fetchFieldData(){
  //   let params = {
  //     url: "admin/getInvestorList",
  //   }  
  //   this.apiCall.userGetService(params).subscribe((result:any)=>{
  //     let resu = result.body;
  //     if(resu.error == false)
  //     {
  //       this.getField = resu.fields;

  //       const field_name = this.getField.map((it)=>{
  //         return it.fieldId
  //       })
  
  //       this.abc = this.temp.map((item)=>{
  //         const a = {}
  //         field_name.forEach((f)=>{
  //           a[f] = item[f]
  
  //         })
  //         return item = a
  //       })
  //       console.log("fef",this.abc)

  //     }else{
  //       this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
  //     }
  //   },(error)=>{
  //      console.error(error);
       
  //   });
  //  }


 fetchLoginHist(){
  let params = {
    url: "admin/getUserHistoryByID",
    user_Id : this.userId,
  }  
  this.apiCall.smallGetService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
      this.getuserList = resu.data; 
    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });
}

}
