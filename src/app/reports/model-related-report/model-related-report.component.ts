import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-model-related-report',
  templateUrl: './model-related-report.component.html',
  styleUrls: ['./model-related-report.component.scss']
})
export class ModelRelatedReportComponent implements OnInit {
  allorNothingData = [];
  showAccept = true;

  constructor(private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[7].write
      // console.log("prer", contentPermssion[7])
    }
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
