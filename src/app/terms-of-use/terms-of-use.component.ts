import { Component, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.scss']
})
export class TermsOfUseComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  public Editor = DecoupledEditor;
     public onReady( editor ) {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
    }
    addTerms: FormGroup;
  accToken:any;
  updatedby:any;
  role:any;
  termsList:any;
  termscont:any;
  termsID:any;
  isEdit = false;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Terms of Use', active: true }];

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addTerms   = this.formBuilder.group({
      termsContent: [''],
      termsContent_Ar: [''],
    })

    var params = {
      url: 'admin/getAllTermsContent',
      data: {}
    }

    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          // console.log(response.body)
          this.termsList = response.body.data
          this.termscont = response.body.data[0].termsContent

          this.addTerms   = this.formBuilder.group({
            termsContent: [response.body.data[0].termsContent,[]],
            termsContent_Ar: [response.body.data[0].termsContent_Ar,[]],
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
  }

  onSubmit(){

    if(this.isEdit){
      this.termsEditService(this.addTerms.value)
      return;
    }

    const postData = this.addTerms.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/saveTermsContent',
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

  termPrivacy(data){
    // console.log("edit",data)

    this.isEdit = true;
      this.termsID = data['_id']
  }


  termsEditService(data){
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    
    data['termsId'] = this.termsID;
    data['_is_Deleted_'] = false;
    data['_is_visible_'] = true;
    var params = {
      url: 'admin/updateTermsContent',
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
