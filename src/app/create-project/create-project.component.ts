import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby: any;
  role: any;
  commonNotes: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Create Project Page', active: true }];
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.commonNotes = this.formBuilder.group({
      commonNotes: [''],
      commonNotesAr: [''],
    });

    this.fetchNotesData();
  }

  fetchNotesData() {
    let params = {
      url: "admin/getCreateProjectPageCMS",
    }
    this.apiCall.commonGetService(params).subscribe((result: any) => {
      let resu = result.body;
      if (resu.error == false) {

        this.commonNotes = this.formBuilder.group({
          commonNotes: [resu.data.commonNotes, []],
          commonNotesAr: [resu.data.commonNotesAr, []],
        });

      } else {
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    }, (error) => {
      console.error(error);

    });
  }

  onSubmit() {
    const postData = this.commonNotes.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postCommonNotesCMS',
      data: postData
    }
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
