import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-right-image-section',
  templateUrl: './right-image-section.component.html',
  styleUrls: ['./right-image-section.component.scss']
})
export class RightImageSectionComponent implements OnInit {
  updatedby:any;
  role:any;
  imagePreview = null;
  fileUpload: any;
  imgUrl:any;
  leftSideImage:FormGroup;
  showAccept = true;

constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.leftSideImage = this.formBuilder.group({
      headTitle: [''],
      headTitle_Ar: [''],
      Description: [''],
      Description_Ar: [''],
      ImageURL: [''],
      buttonName: [''],
      buttonName_Ar: [''],
      buttonURL: ['']
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
      url: "admin/getWhatWeDoContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.imagePreview = resu.data.imageDescSection[0].ImageURL;
        this.leftSideImage = this.formBuilder.group({
          headTitle: [resu.data.imageDescSection[0].headTitle,[]],
          headTitle_Ar: [resu.data.imageDescSection[0].headTitle_Ar,[]],
          Description: [resu.data.imageDescSection[0].Description,[]],
          Description_Ar: [resu.data.imageDescSection[0].Description_Ar,[]],
          ImageURL: [''],
          buttonName: [resu.data.imageDescSection[0].buttonName,[]],
          buttonName_Ar: [resu.data.imageDescSection[0].buttonName_Ar,[]],
          buttonURL: [resu.data.imageDescSection[0].buttonURL,[]],
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
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
      console.log("img",this.fileUpload)
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
                    const data = this.leftSideImage.value;
                    data['ImageURL'] = this.imgUrl;
                    data['createdBy'] = this.updatedby;
                    data['userType'] = "admin";
                    data['role'] = this.role;
                  
                  var params1 = {
                  url: 'admin/postImageDescSection_WWD',
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
        const data = this.leftSideImage.value;
        data['ImageURL'] = this.imagePreview;
        data['createdBy'] = this.updatedby;
        data['userType'] = "admin";
        data['role'] = this.role;
      
      var params1 = {
      url: 'admin/postImageDescSection_WWD',
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
