import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,FormControl  } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-investor-field',
  templateUrl: './investor-field.component.html',
  styleUrls: ['./investor-field.component.scss']
})
export class InvestorFieldComponent implements OnInit {

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');

  getfieldData:any=[];

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.fetchFieldData();

  }


  fetchFieldData(){
    let params = {
       url: "admin/getUserProfileCreationField",
     }  
     this.apiCall.commonGetService(params).subscribe((result:any)=>{
       let resu = result.body;
       if(resu.error == false)
       {
         this.getfieldData = resu.data;
         console.log("dafa",this.getfieldData)
       }else{
         this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
       }
     },(error)=>{
        console.error(error);
        
     });
     }
   
     submitForm(){
   
     }

}
