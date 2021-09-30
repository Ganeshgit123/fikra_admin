import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators, Form} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

export class UploadAdapter {
  private loader;
  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file
          .then( file => new Promise( ( resolve, reject ) => {
                var myReader= new FileReader();
                myReader.onloadend = (e) => {
                   resolve({ default: myReader.result });
                }

                myReader.readAsDataURL(file);
          } ) );
 };
}

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss']
})
export class CareerComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  addCareer:FormGroup;
  imagePreview = null;
  fileUpload: any;
  imgUrl:any;
  candidateListData:any;
  jobData:any;
  showAccept = true;

  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
     editor.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      console.log(btoa(loader.file));
      return new UploadAdapter(loader);
    };
 }

   constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Career Page', active: true }];

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addCareer   = this.formBuilder.group({
      careerImage: [''],
      head: [''],
      advantageContent: [''],
      benifitContent: [''],
      headAr: [''],
      advantageContentAr: [''],
      benifitContentAr: [''],
    })

    this.fetchContentList();
    this.fetchJobData();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchContentList(){
    let params = {
      url: "admin/getCareerContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.addCareer = this.formBuilder.group({
          careerImage:  [''],
          head: [resu.data.head,[]],
          advantageContent:  [resu.data.advantageContent,[]],
          benifitContent:  [resu.data.benifitContent,[]],
          advantageContentAr: [resu.data.advantageContentAr,[]],
          benifitContentAr: [resu.data.benifitContentAr,[]],
          headAr: [resu.data.headAr,[]],
    });
    this.imagePreview = resu.data.careerImage
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
    if(checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'image/jpg' || checkFile.type == 'image/TIF' || checkFile.type == 'image/tif' || checkFile.type == 'image/tiff'){
      return false;
    } else {
      return true;
    }
  }


  onCarrerUpdate(){
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
                    data['careerImage'] = this.imgUrl;
            
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

    console.log("lol",this.imgUrl)
    const data = this.addCareer.value;
    data['careerImage'] = this.imagePreview;
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
  
  var params1 = {
  url: 'admin/postCareerContent',
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
  

  fetchJobData(){
    let params = {
      url: "admin/getAllJobsList",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.jobData = resu.data;
        // console.log("ef",this.branchList)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  jobclick(id){
    let params = {
      url: "admin/getCandidateByJobId",
      jobsId : id
    }  
    this.apiCall.jobGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.candidateListData = resu.data;
        // console.log("job",this.candidateListData)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

}
