import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-add-handbook',
  templateUrl: './add-handbook.component.html',
  styleUrls: ['./add-handbook.component.scss']
})
export class AddHandbookComponent implements OnInit {
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
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addHandbookData = this.formBuilder.group({
      handbookImg: [''],
      handBookHead: [''],
      handBookBody: [''],
      handBookHeadAr: [''],
      handBookBodyAr: [''],
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


  onSubmit(){

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

              const postData = this.addHandbookData.value;
    postData['handbookImg'] = this.imgUrl;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params1 = {
      url: 'admin/createHandbookforUser',
      data: postData
    }

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

}
