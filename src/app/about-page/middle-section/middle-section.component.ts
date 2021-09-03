import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators, Form} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-middle-section',
  templateUrl: './middle-section.component.html',
  styleUrls: ['./middle-section.component.scss']
})
export class MiddleSectionComponent implements OnInit {
  updatedby:any;
  role:any;
  imagePreview = null;
  fileUpload: any;
  addMiddleCont:FormGroup;
  middleStatus:any;
  showAccept = true;

  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
 }

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addMiddleCont   = this.formBuilder.group({
      middleHead: [''],
      middileContend: [''],
      middleHeadAr: [''],
      middileContendAr: [''],
    })

    this.fetchAboutList();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchAboutList(){
    let params = {
      url: "admin/getAboutContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.addMiddleCont = this.formBuilder.group({
          middleHead: [resu.data.middleHead,[]],
          middileContend: [resu.data.middileContend,[]],
          middleHeadAr: [resu.data.middleHeadAr,[]],
          middileContendAr: [resu.data.middileContendAr,[]],
        });

        this.middleStatus = resu.data._is_Middle_On_;

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  uploadImageFile(event){
    var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = event.target.files[0]
  }

  onMiddleUpdate(){
    const postData = this.addMiddleCont.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postMiddleSectionAboutUs',
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

  onchangeMiddleStatus(values:any){
    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['_is_Middle_On_'] = visible;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/updateStatusMiddleAboutUs',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast("Changed Successfully", 'Success', 'successToastr')
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
