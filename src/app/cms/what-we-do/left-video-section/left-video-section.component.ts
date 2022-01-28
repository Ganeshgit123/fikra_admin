import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-left-video-section',
  templateUrl: './left-video-section.component.html',
  styleUrls: ['./left-video-section.component.scss']
})
export class LeftVideoSectionComponent implements OnInit {
  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
 }
  updatedby:any;
  role:any;
  videoSecContent:FormGroup;
  showAccept = true;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    
    this.videoSecContent = this.formBuilder.group({
      headTitle: [''],
      Description: [''],
      headTitle_Ar: [''],
      Description_Ar: [''],
      viderURL: ['']
    });

    this.fetchVideoSecData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchVideoSecData(){
    let params = {
      url: "admin/getWhatWeDoContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.videoSecContent = this.formBuilder.group({
          headTitle: [resu.data.videoDescSection[0].headTitle,[]],
          Description: [resu.data.videoDescSection[0].Description,[]],
          headTitle_Ar: [resu.data.videoDescSection[0].headTitle_Ar,[]],
          Description_Ar: [resu.data.videoDescSection[0].Description_Ar,[]],
          viderURL: [resu.data.videoDescSection[0].viderURL,[]],
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onSubmit(){
    const postData = this.videoSecContent.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postvideoDescSection_WWD',
      data: postData
    }
    // console.log("data",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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
