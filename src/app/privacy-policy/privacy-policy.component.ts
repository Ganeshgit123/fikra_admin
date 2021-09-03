import { Component, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  public Editor = DecoupledEditor;
     public onReady( editor ) {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
    }
  addPrivacy: FormGroup;
  accToken:any;
  updatedby:any;
  role:any;
  privacyList:any;
  privacycont:any;
  privacyID:any;
  isEdit = false;
  showAccept = true;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Privacy Policy', active: true }];

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addPrivacy   = this.formBuilder.group({
      privacyContent: [''],
      privacyContent_Ar: [''],
    })

    var params = {
      url: 'admin/getAllPrivacyContent',
      data: {}
    }

    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          // console.log(response.body)
          this.privacyList = response.body.data
          this.privacycont = response.body.data[0].cookieContent

          this.addPrivacy   = this.formBuilder.group({
            privacyContent: [response.body.data[0].privacyContent,[]],
            privacyContent_Ar: [response.body.data[0].privacyContent_Ar,[]],
          })
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
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  onSubmit(){

    if(this.isEdit){
      this.privacyEditService(this.addPrivacy.value)
      return;
    }

    const postData = this.addPrivacy.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/savePrivacyContenet',
      data: postData
    }
// console.log("ddd",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          // console.log("res",response.body)

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


  editPrivacy(data){
    // console.log("edit",data)

    this.isEdit = true;
      this.privacyID = data['_id']
  }

  privacyEditService(data){
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    
    data['privacyId'] = this.privacyID;
    data['_is_Deleted_'] = false;
    data['_is_visible_'] = true;
    var params = {
      url: 'admin/updatePrivacyContenet',
      data: data
    }

    this.apiCall.commonPutService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.isEdit = false;
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
