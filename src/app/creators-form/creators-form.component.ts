import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,FormControl  } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-creators-form',
  templateUrl: './creators-form.component.html',
  styleUrls: ['./creators-form.component.scss']
})
export class CreatorsFormComponent implements OnInit {
  getCreatorData:any=[];
  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');

  creaFieldId:any;
  searchTerm;
  showAccept = true;
  page = 1;
  total: any;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.fetchCreatorFieldData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let singupPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = singupPermssion[5].write
      // console.log("prer", singupPermssion[5])
    }
  }

  fetchCreatorFieldData(){
    let params = {
       url: "admin/getCreatorProfileCreationField",
     }  
     this.apiCall.commonGetService(params).subscribe((result:any)=>{
       let resu = result.body;
       if(resu.error == false)
       {
         this.getCreatorData = resu.data;
        this.total = this.getCreatorData.length
        //  console.log("dafa",this.getCreatorData)
       }else{
         this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
       }
     },(error)=>{
        console.error(error);
        
     });
     }
   
     clickCreateField(item){
      this.creaFieldId = item._id
      item.isEdit = true
      this.apiCall.createFiedlValue(item)
     }

}
