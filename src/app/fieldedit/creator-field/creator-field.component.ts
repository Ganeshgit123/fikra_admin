import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,FormControl  } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-creator-field',
  templateUrl: './creator-field.component.html',
  styleUrls: ['./creator-field.component.scss']
})
export class CreatorFieldComponent implements OnInit {
  getCreatorData:any=[];
  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');

  creaFieldId:any;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.fetchCreatorFieldData();

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
         console.log("dafa",this.getCreatorData)
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
