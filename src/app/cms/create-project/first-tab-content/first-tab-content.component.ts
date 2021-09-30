import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-first-tab-content',
  templateUrl: './first-tab-content.component.html',
  styleUrls: ['./first-tab-content.component.scss']
})
export class FirstTabContentComponent implements OnInit {
  updatedby:any;
  role:any;
  addBusinessModal: FormGroup;
  imagePreview = null;
  fileUpload: any;
  imgUrl:any;

 constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addBusinessModal = this.formBuilder.group({
      tabName: [''],
      tabName_Ar: [''],
      tabHead: [''],
      tabHead_Ar: [''],
      tabDesc: [''],
      tabDesc_Ar: [''],
      tabFooter: [''],
      tabFooter_Ar: [''],
      business_KIA_Desc: [''],
      business_KIA_Desc_Ar: [''],
      business_AON_Desc: [''],
      business_AON_Desc_Ar: [''],
      image: ['']
    });

    this.fetchFirstTabData();

  }

  fetchFirstTabData(){
    let params = {
      url: "admin/getCreateProjectPageCMS",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.imagePreview = resu.data.model[0].image;

        this.addBusinessModal = this.formBuilder.group({
          tabName: [resu.data.model[0].tabName,[]],
          tabName_Ar: [resu.data.model[0].tabName_Ar,[]],
          tabHead: [resu.data.model[0].tabHead,[]],
          tabHead_Ar: [resu.data.model[0].tabHead_Ar,[]],
          tabDesc: [resu.data.model[0].tabDesc,[]],
          tabDesc_Ar: [resu.data.model[0].tabDesc_Ar,[]],
          tabFooter: [resu.data.model[0].tabFooter,[]],
          tabFooter_Ar: [resu.data.model[0].tabFooter_Ar,[]],
          business_KIA_Desc: [resu.data.model[0].business_KIA_Desc,[]],
          business_KIA_Desc_Ar: [resu.data.model[0].business_KIA_Desc_Ar,[]],
          business_AON_Desc: [resu.data.model[0].business_AON_Desc,[]],
          business_AON_Desc_Ar: [resu.data.model[0].business_AON_Desc_Ar,[]],
          image: ['']
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
      // console.log(this.filesToUpload)
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
                    data['image'] = this.imgUrl;
            
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
      }

    // console.log("lol",this.imgUrl)
    const data = this.addBusinessModal.value;
    data['image'] = this.imagePreview;
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
  
  var params1 = {
  url: 'admin/postProjectCreationModelPage_CMS',
  data: data
  }
  // console.log("img",params1)
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
