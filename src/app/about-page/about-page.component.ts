import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators, Form} from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  imagePreview = null;
  fileUpload: any;
  addBanner:FormGroup;
  topStatus:any;
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
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'About Page', active: true }];

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addBanner   = this.formBuilder.group({
      topImage: [''],
      topHead: [''],
      topHeadAr: [''],
      topContent: [''],
      topContentAr: [''],
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
        this.imagePreview = resu.data.topImage;
        this.addBanner = this.formBuilder.group({
          topImage: [''],
          topHead: [resu.data.topHead,[]],
          topHeadAr: [resu.data.topHeadAr,[]],
          topContent: [resu.data.topContent,[]],
          topContentAr: [resu.data.topContentAr,[]],
        });

        this.topStatus = resu.data._is_Top_On_;

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

  onTopUpdate(){

    var data:any = new FormData();
    data.append('topHead', this.addBanner.get('topHead').value);
    data.append('topContent', this.addBanner.get('topContent').value);
    data.append('topHeadAr', this.addBanner.get('topHeadAr').value);
    data.append('topContentAr', this.addBanner.get('topContentAr').value);
    data.append('topImage', this.fileUpload);
    data.append('createdBy', this.updatedby);
    data.append('userType', 'admin');
    data.append('role', this.role);

 var params = {
   url: 'admin/postTopSectionAboutUs',
   data: data
 }
 // console.log("ppp",params)
 this.apiCall.commonPostService(params).subscribe(
  (response: any) => {
    console.log("res",response)

    if (response.body.error == false) {
 
      this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
      this.imagePreview = null;
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

  onchangeTopStatus(values:any){
    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['_is_Top_On_'] = visible;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/updateStatusTopAboutUs',
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
