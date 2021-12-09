import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-three-content-section',
  templateUrl: './three-content-section.component.html',
  styleUrls: ['./three-content-section.component.scss']
})
export class ThreeContentSectionComponent implements OnInit {
  updatedby:any;
  role:any;
  addMultiContentForm:FormGroup;
  imagePreview = null;
  fileUpload: any;
  imgUrl:any;
  showAccept = true;
  multiContentData = [];
  page = 1;
  total: any;
  isEdit = false;
  multiContentId:any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    
    this.addMultiContentForm = this.formBuilder.group({
      title: [''],
      title_Ar: [''],
      description: [''],
      description_Ar: [''],
      readMoreURL: [''],
      imageURL: [''],
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
      url: "admin/getWhatWeDoContent",
    }  
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {

        this.multiContentData = response.body.data.multipleSection;
      }else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
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
      // console.log(this.fileUpload)
    }
  }

  
  checkFileFormat(checkFile){
    if(checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'image/jpg' || checkFile.type == 'image/TIF' || checkFile.type == 'image/tif' || checkFile.type == 'image/tiff'){
      return false;
    } else {
      return true;
    }
  }

  addMultiContent(multiContentSection: any){
    this.addMultiContentForm.reset();
    this.imagePreview = null;
    this.modalService.open(multiContentSection, { centered: true });
  }

  viewMultiContentData(data,multiContentSection: any){
    // console.log(data)
    this.modalService.open(multiContentSection, { centered: true });
    this.isEdit = true;
    this.imagePreview = data['imageURL'];
    this.multiContentId = data['_id'];

    this.addMultiContentForm   = this.formBuilder.group({
      imageURL: [''],
      title: [data['title']],
      title_Ar: [data['title_Ar']],
      description: [data['description']],
      description_Ar: [data['description_Ar']],
      readMoreURL: [data['readMoreURL']],
    })
  }

  onMultiContentSubmit(){

    if(this.isEdit){
      this.multiContentEditService(this.addMultiContentForm.value)
      return;
    }

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

              const postData = this.addMultiContentForm.value;
    postData['imageURL'] = this.imgUrl;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params1 = {
      url: 'admin/pushMultipleSection_WWD',
      data: postData
    }

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
  }


  multiContentEditService(data){
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
                    const data = this.addMultiContentForm.value;
                    data['imageURL'] = this.imgUrl;
                    data['multiContentId'] = this.multiContentId;
                    data['createdBy'] = this.updatedby;
                    data['userType'] = "admin";
                    data['role'] = this.role;
                  
                  var params1 = {
                  url: 'admin/editMultipleSection_WWD',
                  data: data
                  }
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
        const data = this.addMultiContentForm.value;
        data['imageURL'] = this.imagePreview;
        data['multiContentId'] = this.multiContentId;
        data['createdBy'] = this.updatedby;
        data['userType'] = "admin";
        data['role'] = this.role;
      
      var params1 = {
      url: 'admin/editMultipleSection_WWD',
      data: data
      }
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

  onDeleteMultiContent(id){
    const object = {}
  
    object['multiContentId'] = id;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/removeMultipleSection_WWD',
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
