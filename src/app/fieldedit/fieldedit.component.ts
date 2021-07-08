import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormBuilder,FormControl  } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { FormData } from 'form-data';

@Component({
  selector: 'app-fieldedit',
  templateUrl: './fieldedit.component.html',
  styleUrls: ['./fieldedit.component.scss']
})
export class FieldeditComponent implements OnInit {
  @Input()formData: FormData[];
  submitted: boolean;

  editForm: FormGroup;
  updatedby:any;
  role:any;
  formList:any;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    const formGroup = {};

    this.formData.forEach(formControl => {
      formGroup[formControl.fieldId] = new FormControl('');
    });

    console.log("few",this.formData)

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.editForm   = this.formBuilder.group(
      formGroup
    )
    console.log("data",this.editForm)


    var params = {
      url: 'admin/getUserProfileCreationField',
      data: {}
    }

    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          // console.log(response.body)
          this.formList = response.body.data
                    console.log("data",this.formList)

          this.editForm  = this.formBuilder.group({
            formGroup: [response.body.data,[]],
          })
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

  submitForm(){

  }


}