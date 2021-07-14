import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder,FormControl  } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-fieldedit',
  templateUrl: './fieldedit.component.html',
  styleUrls: ['./fieldedit.component.scss']
})
export class FieldeditComponent implements OnInit {

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');

  breadCrumbItems: Array<{}>;
  getfieldData:any=[];

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [{ label: 'Invesors List', active: true }];

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