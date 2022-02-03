import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-rules-accordian',
  templateUrl: './rules-accordian.component.html',
  styleUrls: ['./rules-accordian.component.scss']
})
export class RulesAccordianComponent implements OnInit {
  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
 }
  updatedby:any;
  role:any;
  addRuleAccordianForm:FormGroup;
  imagePreview = null;
  fileUpload: any;
  imgUrl:any;
  showAccept = true;
  ruleAccordianData = [];
  page = 1;
  total: any;
  isEdit = false;
  accordianId:any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    
    this.addRuleAccordianForm = this.formBuilder.group({
      Header: [''],
      Header_Ar: [''],
      Description: [''],
      Description_Ar: [''],
      downloadLink: [''],
    });

    this.fetchMultiContentData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchMultiContentData(){
    let params = {
      url: "admin/getOurRuleContent",
    }  
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {

        this.ruleAccordianData = response.body.data.accordian;
        this.total = this.ruleAccordianData.length;
// console.log("dd",this.ruleAccordianData)
      }else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  uploadImageFile(event){
    const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = file
      // console.log(this.fileUpload)
  }

  addRuleAccordianContent(rulesAccordianSection: any){
    this.addRuleAccordianForm.reset();
    this.isEdit = false;
    this.imagePreview = null;
    this.fileUpload = null;
    this.modalService.open(rulesAccordianSection, { centered: true, size: 'xl'  });
  }

  viewRuleAccordianData(data,rulesAccordianSection: any){
    this.modalService.open(rulesAccordianSection, { centered: true, size: 'xl'  });
    this.isEdit = true;
    this.imagePreview = data['downloadLink'];
    this.accordianId = data['_id'];

    this.addRuleAccordianForm   = this.formBuilder.group({
      Header: [data['Header']],
      Header_Ar: [data['Header_Ar']],
      Description: [data['Description']],
      Description_Ar: [data['Description_Ar']],
      downloadLink: [data['downloadLink']],
    })
  }

  removeImg(){
    this.imagePreview = null;
    this.fileUpload = null;
  }

  onAccordianSubmit(){

    if(this.isEdit){
      this.accordianEditService(this.addRuleAccordianForm.value)
      return;
    }
    if(this.fileUpload){
    var postData = new FormData();

    postData.append('imageToStore', this.fileUpload);

    var params = {
      url: 'admin/postImagetoS3',
      data: postData
    }
    this.spinner.show();

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {

        if (response.body.error == false) {
              this.imgUrl = response.body.data.Location

              const postData = this.addRuleAccordianForm.value;
    postData['downloadLink'] = this.imgUrl;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params1 = {
      url: 'admin/postAccordianSection_OurRule',
      data: postData
    }
    // console.log("add",params1)
    this.apiCall.commonPostService(params1).subscribe(
      (response: any) => {
        if (response.body.error == false) {

          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.imagePreview = null;
          this.modalService.dismissAll();
          this.ngOnInit();
          this.spinner.hide();
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
          this.spinner.hide();
        }
      },
    )
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
          this.spinner.hide();
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        this.spinner.hide();
        console.log('Error', error)
      } 
    )
    }else{
      const postData = this.addRuleAccordianForm.value;
    postData['downloadLink'] = this.imagePreview;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params1 = {
      url: 'admin/postAccordianSection_OurRule',
      data: postData
    }
    // console.log("add",params1)
    this.apiCall.commonPostService(params1).subscribe(
      (response: any) => {
      if (response.body.error == false) {
      
      this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
      this.imagePreview = null;
      this.modalService.dismissAll();
      this.ngOnInit();
      this.spinner.hide();
      } else {
      this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
      }
      },
      (error) => {
      this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      this.spinner.hide();
      console.log('Error', error)
      } 
      )
    }
  }

  accordianEditService(data){
    if(this.fileUpload){
      var postData = new FormData();
  
      postData.append('imageToStore', this.fileUpload);
  
      var params = {
        url: 'admin/postImagetoS3',
        data: postData
      }
      this.spinner.show();
  
      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
  
          if (response.body.error == false) {
                this.imgUrl = response.body.data.Location
                    const data = this.addRuleAccordianForm.value;
                    data['downloadLink'] = this.imgUrl;
                    data['accId'] = this.accordianId;
                    data['createdBy'] = this.updatedby;
                    data['userType'] = "admin";
                    data['role'] = this.role;
                  
                  var params1 = {
                  url: 'admin/editAccordianSection_OurRule',
                  data: data
                  }
                  // console.log("edit",params1)
                  this.apiCall.commonPostService(params1).subscribe(
                  (response: any) => {
                  if (response.body.error == false) {
                  
                  this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
                  this.isEdit = false;
                  this.imagePreview = null;
                  this.modalService.dismissAll();
                  this.ngOnInit();
                  this.spinner.hide();
                  } else {
                  this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
                  }
                  },
                  (error) => {
                  this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
                  this.spinner.hide();
                  console.log('Error', error)
                  } 
                  )
  
              } else {
            // Query Error
            this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
            this.spinner.hide();
          }
        },
        (error) => {
          this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
          this.spinner.hide();
          console.log('Error', error)
        } 
      )
      }else{
        const data = this.addRuleAccordianForm.value;
              data['downloadLink'] = this.imagePreview;
              data['accId'] = this.accordianId;
              data['createdBy'] = this.updatedby;
              data['userType'] = "admin";
              data['role'] = this.role;
      
      var params1 = {
      url: 'admin/editAccordianSection_OurRule',
      data: data
      }
      // console.log("edit",params1)
      this.apiCall.commonPostService(params1).subscribe(
      (response: any) => {
      if (response.body.error == false) {
      
      this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
      this.imagePreview = null;
      this.isEdit = false;
      this.modalService.dismissAll();
      this.ngOnInit();
      this.spinner.hide();
      } else {
      this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
      }
      },
      (error) => {
      this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      this.spinner.hide();
      console.log('Error', error)
      } 
      )
      }
  }

  onDeleteAccordian(id){
    const object = {}
  
    object['accId'] = id;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/removeAccordianSection_OurRule',
     data: object
   }
  //  console.log("da",params)
   this.apiCall.commonPostService(params).subscribe(
     (response: any) => {
       if (response.body.error == false) {
         // Success
         this.apiCall.showToast("Deleted Successfully", 'Success', 'successToastr')
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
