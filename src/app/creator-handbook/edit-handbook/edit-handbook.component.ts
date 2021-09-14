import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-edit-handbook',
  templateUrl: './edit-handbook.component.html',
  styleUrls: ['./edit-handbook.component.scss']
})
export class EditHandbookComponent implements OnInit {
  updatedby:any;
  role:any;
  imagePreview = null;
  fileUpload: any;
  addHandbookData:FormGroup;
  handBookData:any;
  imgUrl:any;
  isEdit:any;
  handBookId:any;

  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
 }

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.handBookId = params.id);
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addHandbookData = this.formBuilder.group({
      handbookImg: [''],
      handBookHead: [''],
      handBookBody: [''],
      handBookHeadAr: [''],
      handBookBodyAr: [''],
    });

    this.fetchhandBookData();
  }

  fetchhandBookData(){
    let params = {
      url: "admin/getHandbookById",
      handBookId : this.handBookId
    }  
    this.apiCall.handBookGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.addHandbookData = this.formBuilder.group({
      handbookImg:  [''],
      handBookHead: [resu.data.handBookHead,[]],
      handBookBody:  [resu.data.handBookBody,[]],
      handBookHeadAr:  [resu.data.handBookHeadAr,[]],
      handBookBodyAr: [resu.data.handBookBodyAr,[]],
    });
    this.imagePreview = resu.data.handbookImg
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
    } else {
      // Not valild image
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
                    data['handbookImg'] = this.imgUrl;
            
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
    const data = this.addHandbookData.value;
    data['handbookImg'] = this.imagePreview;
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['handBookId'] = this.handBookId;
  
  var params1 = {
  url: 'admin/updateHandbookforUser',
  data: data
  }
  console.log("img",params1)
  this.apiCall.commonPostService(params1).subscribe(
  (response: any) => {
  if (response.body.error == false) {
  
  this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
  this.imagePreview = null;
  this.ngOnInit();
  this.spinner.hide();
  this.router.navigateByUrl('/creator_handbook');
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
