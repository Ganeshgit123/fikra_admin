import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-rules-middle-content',
  templateUrl: './rules-middle-content.component.html',
  styleUrls: ['./rules-middle-content.component.scss']
})
export class RulesMiddleContentComponent implements OnInit {
  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
 }
  updatedby:any;
  role:any;
  rulesMiddleContent:FormGroup;
  addJourneyForm:FormGroup;
  showAccept = true;
  page = 1;
  total: any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    
    this.rulesMiddleContent = this.formBuilder.group({
      Header: [''],
      Header_Ar: [''],
      Description: [''],
      Description_Ar: [''],
    });

    this.fetchMiddleData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchMiddleData(){
    let params = {
      url: "admin/getOurRuleContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.rulesMiddleContent = this.formBuilder.group({
          Header: [resu.data.bodySection[0].Header,[]],
          Header_Ar: [resu.data.bodySection[0].Header_Ar,[]],
          Description: [resu.data.bodySection[0].Description,[]],
          Description_Ar: [resu.data.bodySection[0].Description_Ar,[]],
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onSubmit(){
    const postData = this.rulesMiddleContent.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postBodySection_OurRule',
      data: postData
    }
    // console.log("data",params)
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
