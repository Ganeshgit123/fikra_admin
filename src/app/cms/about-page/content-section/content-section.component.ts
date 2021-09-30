import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators, Form} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss']
})
export class ContentSectionComponent implements OnInit {
  updatedby:any;
  role:any;
  imagePreview = null;
  fileUpload: any;
  addContenteSection:FormGroup;
  sectionList: any = [];
  isEdit = false;
  sectionId:any;
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
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addContenteSection   = this.formBuilder.group({
      secImage: [''],
      secHeadName: [''],
      secHeadNameAr: [''],
      secContent: [''],
      secContentAr: [''],
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
        this.sectionList = resu.data.Sections;
        // console.log("da",this.sectionList)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  addContents(contentModal: any){
    this.modalService.open(contentModal, { centered: true });

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

    if(this.isEdit){
      this.contentEditService(this.addContenteSection.value)
      return;
    }
    var data:any = new FormData();
    data.append('secHeadName', this.addContenteSection.get('secHeadName').value);
    data.append('secHeadNameAr', this.addContenteSection.get('secHeadNameAr').value);
    data.append('secContent', this.addContenteSection.get('secContent').value);
    data.append('secContentAr', this.addContenteSection.get('secContentAr').value);
    data.append('secImage', this.fileUpload);
    data.append('createdBy', this.updatedby);
    data.append('userType', 'admin');
    data.append('role', this.role);

 var params = {
   url: 'admin/postDynamicSections',
   data: data
 }
//  console.log("ppp",params)
 this.apiCall.commonPostService(params).subscribe(
  (response: any) => {
    if (response.body.error == false) {
 
      this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
      this.modalService.dismissAll();
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

  viewContent(data,contentModal: any){
    this.modalService.open(contentModal, { centered: true });
    this.isEdit = true;
    this.imagePreview = data['secImage'];
    this.sectionId = data['_id'];

    this.addContenteSection   = this.formBuilder.group({
      secImage: [''],
      secHeadName: [data['secHeadName']],
      secHeadNameAr: [data['secHeadNameAr']],
      secContent: [data['secContent']],
      secContentAr: [data['secContentAr']],
    })
  }

  contentEditService(data){
    var data:any = new FormData();
    data.append('secHeadName', this.addContenteSection.get('secHeadName').value);
    data.append('secHeadNameAr', this.addContenteSection.get('secHeadNameAr').value);
    data.append('secContent', this.addContenteSection.get('secContent').value);
    data.append('secContentAr', this.addContenteSection.get('secContentAr').value);
    data.append('secImage', this.fileUpload);
    data.append('createdBy', this.updatedby);
    data.append('userType', 'admin');
    data.append('role', this.role);
    data.append('sectionId', this.sectionId);


 var params = {
   url: 'admin/updateDynamicSections',
   data: data
 }
 // console.log("ppp",params)
 this.apiCall.commonPutService(params).subscribe(
   (response: any) => {
     if (response.body.error == false) {
       // Success
       this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
       this.isEdit = false;
       this.modalService.dismissAll();
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

  onchangeContentStatus(values:any,val){
    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['sectionId'] = val;
     object['_is_Sec_On_'] = visible;
     object['_is_Sec_Delete'] = false;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/updateDynamicSectionsStatus',
      data: object
    }
    this.apiCall.commonPutService(params).subscribe(
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

  onDeleteContentStatus(val,id,visible){
    const object = {}

    object['sectionId'] = id;
    object['_is_Sec_On_'] = visible;
    object['_is_Sec_Delete'] = val;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/updateDynamicSectionsStatus',
     data: object
   }
  //  console.log("da",params)
   this.apiCall.commonPutService(params).subscribe(
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
