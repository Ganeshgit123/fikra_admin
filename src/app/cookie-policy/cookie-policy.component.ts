import { Component, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']
})
export class CookiePolicyComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  accToken:any;
  updatedby:any;
  role:any;
  cookieList: any;
  cookiecont: any;
  cookieID:any;
  isEdit = false;


  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
 }

 addCookie: FormGroup;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Cookie Policy', active: true }];
    
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addCookie   = this.formBuilder.group({
      cookieContent: [''],
    })

    var params = {
      url: 'admin/getAllCookiesContent',
      data: {}
    }

    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          // console.log(response.body)
          this.cookieList = response.body.data
          this.cookiecont = response.body.data[0].cookieContent

          this.addCookie   = this.formBuilder.group({
            cookieContent: [response.body.data[0].cookieContent,[]],
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
      this.cookieEditService(this.addCookie.value)
      return;
    }

    const postData = this.addCookie.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/saveCookiesContent',
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

  editCookie(data){
    // console.log("edit",data)

    this.isEdit = true;
      this.cookieID = data['_id']
  }

  async cookieEditService(data){
     
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    
    data['cookieId'] = this.cookieID;
    data['_is_Deleted_'] = false;
    data['_is_visible_'] = true;
    var params = {
      url: 'admin/updateCookiesContent',
      data: data
    }
// console.log("editdata",params)
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
