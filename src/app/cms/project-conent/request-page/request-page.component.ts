import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';

@Component({
  selector: 'app-request-page',
  templateUrl: './request-page.component.html',
  styleUrls: ['./request-page.component.scss']
})
export class RequestPageComponent implements OnInit {
  updatedby:any;
  role:any;
  addRequestContent: FormGroup;
  searchTerm;
  showAccept = true;
  page = 1;
  total: any;

 constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService    ) { }

    ngOnInit(): void {
      this.updatedby = sessionStorage.getItem('adminId');
      this.role = sessionStorage.getItem('adminRole');
  
      this.addRequestContent = this.formBuilder.group({
        tabName: [''],
        tabName_Ar: [''],
        tabHead: [''],
        tabHead_Ar: [''],
        description: [''],
        description_Ar: [''],
        message: [''],
        message_Ar: [''],
        rules: [''],
        rules_Ar: [''],
      });
  
      this.fetchRequestData();
    this.callRolePermission();
    }
  
    callRolePermission(){
      if(sessionStorage.getItem('adminRole') !== 's_a_r'){
        let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
        this.showAccept = contentPermssion[3].write
        // console.log("prer", contentPermssion[3])
      }
    }
    
    fetchRequestData(){
      let params = {
        url: "admin/getProjectRequestPageCMS",
      }  
      this.apiCall.commonGetService(params).subscribe((result:any)=>{
        let resu = result.body;
        if(resu.error == false)
        {
  
          this.addRequestContent = this.formBuilder.group({
            tabName: [resu.data.tabName,[]],
            tabName_Ar: [resu.data.tabName_Ar,[]],
            tabHead: [resu.data.tabHead,[]],
            tabHead_Ar: [resu.data.tabHead_Ar,[]],
            description: [resu.data.description,[]],
            description_Ar: [resu.data.description_Ar,[]],
            message: [resu.data.message,[]],
            message_Ar: [resu.data.message_Ar,[]],
            rules: [resu.data.rules,[]],
            rules_Ar: [resu.data.rules_Ar,[]],
          });
  
        }else{
          this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
        }
      },(error)=>{
         console.error(error);
         
      });
    }
  
    onSubmit(){
      const postData = this.addRequestContent.value;
      postData['createdBy'] = this.updatedby;
      postData['userType'] = "admin";
      postData['role'] = this.role;
  
      var params = {
        url: 'admin/addProjectRequestPageCMS',
        data: postData
      }
      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
          if (response.body.error == false) {
            this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
            this.ngOnInit();
          } else {
            // Query Error
            this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
          }
        },
        (error) => {
          this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
          console.log('Error', error)
        } 
      )
  
    }

}
