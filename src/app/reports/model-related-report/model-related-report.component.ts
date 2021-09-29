import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-model-related-report',
  templateUrl: './model-related-report.component.html',
  styleUrls: ['./model-related-report.component.scss']
})
export class ModelRelatedReportComponent implements OnInit {
  allorNothingData = [];

  constructor(private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
  }

  modelRelatedGetApi(value,arch){
    console.log("ddd",value,arch)
    if(value == 'allOrNothing'){
      let params = {
        url: "admin/getProjectReport_AON_Live",
      }  
      this.apiCall.commonGetService(params).subscribe((result:any)=>{
        let resu = result.body;
        if(resu.error == false)
        {
          this.allorNothingData = resu.data; 
    
        }else{
          this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
        }
      },(error)=>{
         console.error(error);
         
      });
}else if(value == 'keepItAll'){
  let params = {
    url: "admin/getProjectReport_KIA_Live",
  }  
  this.apiCall.commonGetService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
      this.allorNothingData = resu.data; 

    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });
}

if(arch == 'AONarchieve'){
  let params = {
    url: "admin/getProjectReport_AON",
  }  
  this.apiCall.commonGetService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
      this.allorNothingData = resu.data; 

    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });
}else if(arch == 'KIParchieve'){
let params = {
url: "admin/getProjectReport_KIA",
}  
this.apiCall.commonGetService(params).subscribe((result:any)=>{
let resu = result.body;
if(resu.error == false)
{
  this.allorNothingData = resu.data; 

}else{
  this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
}
},(error)=>{
 console.error(error);
 
});
}
  }

}
