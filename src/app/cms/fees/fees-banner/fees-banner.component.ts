import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-fees-banner',
  templateUrl: './fees-banner.component.html',
  styleUrls: ['./fees-banner.component.scss']
})
export class FeesBannerComponent implements OnInit {
  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
 }
  updatedby:any;
  role:any;
  imagePreview = null;
  fileUpload: any;
  imgUrl:any;
  feesContent:FormGroup;
  showAccept = true;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.feesContent = this.formBuilder.group({
      bannerHeader: [''],
      bannerHeader_Ar: [''],
      bannerDescription: [''],
      bannerDescription_Ar: [''],
      bannerImage: ['']
    });

    this.fetchBannerData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchBannerData(){
    let params = {
      url: "admin/getFeesContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.imagePreview = resu.data.topBanner[0].bannerImage;
        this.feesContent = this.formBuilder.group({
          bannerHeader: [resu.data.topBanner[0].bannerHeader,[]],
          bannerHeader_Ar: [resu.data.topBanner[0].bannerHeader_Ar,[]],
          bannerDescription: [resu.data.topBanner[0].bannerDescription,[]],
          bannerDescription_Ar: [resu.data.topBanner[0].bannerDescription_Ar,[]],
          bannerImage: ['']
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  removeImg(){
    this.imagePreview = "";
    this.fileUpload = "";
  }

  uploadImageFile(event){
    const file = event.target.files && event.target.files[0];
    var valid = this.checkFileFormat(event.target.files[0]);
    if(!valid) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = file
      // console.log("img",this.fileUpload)
    }
  }


  checkFileFormat(checkFile){
    if(checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'image/TIF' || checkFile.type == 'image/tif' || checkFile.type == 'image/tiff'){
      return false;
    } else {
      return true;
    }
  }

  onSubmit(){
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
                    const data = this.feesContent.value;
                    data['bannerImage'] = this.imgUrl;
                    data['createdBy'] = this.updatedby;
                    data['userType'] = "admin";
                    data['role'] = this.role;
                  
                  var params1 = {
                  url: 'admin/postFeesTopSection',
                  data: data
                  }
                  this.apiCall.commonPostService(params1).subscribe(
                  (response: any) => {
                  if (response.body.error == false) {
                  
                  this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
                  this.imagePreview = null;
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
        const data = this.feesContent.value;
        data['bannerImage'] = this.imagePreview;
        data['createdBy'] = this.updatedby;
        data['userType'] = "admin";
        data['role'] = this.role;
      
      var params1 = {
      url: 'admin/postFeesTopSection',
      data: data
      }
      this.apiCall.commonPostService(params1).subscribe(
      (response: any) => {
      if (response.body.error == false) {
      
      this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
      this.imagePreview = null;
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

}
