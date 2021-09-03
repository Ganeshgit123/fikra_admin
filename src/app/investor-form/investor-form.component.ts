import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,FormArray,FormControl  } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-investor-form',
  templateUrl: './investor-form.component.html',
  styleUrls: ['./investor-form.component.scss']
})
export class InvestorFormComponent implements OnInit {

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');

  getfieldData:any=[];
  fieldId:any;
  showAccept = true;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.fetchFieldData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let singupPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = singupPermssion[5].write
      // console.log("prer", singupPermssion[5])
    }
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
        //  console.log("dafa",this.getfieldData)
       }else{
         this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
       }
     },(error)=>{
        console.error(error);
        
     });
     }

     clickField(item){
      this.fieldId = item._id
      item.isEdit = true
      this.apiCall.fiedlValue(item)
     }

}

