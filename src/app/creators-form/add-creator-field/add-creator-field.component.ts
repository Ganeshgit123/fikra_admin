import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder,FormArray,FormControl  } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-add-creator-field',
  templateUrl: './add-creator-field.component.html',
  styleUrls: ['./add-creator-field.component.scss']
})
export class AddCreatorFieldComponent implements OnInit {

 
  breadCrumbItems: Array<{}>;

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');

  creatorForm: FormGroup;
  dropDown:any;
  isEdit =false;
  showAccept = false;
  ffiedId:any;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Creator Signup Form' },{ label: 'Add New Field', active: true }];
    this.creatorForm = this.formBuilder.group({
      fieldName: '',
      arabicFieldName:'',
      fieldType: '',
      placeholder: '',
      arabicPlaceholder:'',
      fieldId: '',
      _is_Mandatory_: '',
      defauldValue:'',
      description:'',
      fieldInputType:'',
      dropDown: this.formBuilder.array([
        this.getdropdownValues()
      ]),
    });

    // this.dropDown = this.creatorForm.controls.dropDown.value

    // this.fetchFieldData();

  }

  selected(value){
      // console.log("vv",value)
    if(value === "select" || value ==="radio"){
      var some = true
    }else{
       var some = false
    }

    this.showAccept = some;
    // console.log("aa", this.showAccept)
   }
   
  private getdropdownValues() {
    return this.formBuilder.group({
      displayName: [''],
      value: [''],
    })
  }

  addOptions(){
    let control = <FormArray>this.creatorForm.controls.dropDown;
    control.push(
      this.formBuilder.group({
        displayName: [''],
        value: [''],
      })
    )
  }

  deleteOptions(index){
    let control = <FormArray>this.creatorForm.controls.dropDown;
    control.removeAt(index)
  }

  onSubmit() {
    // console.log(this.creatorForm.value);

    const postData = this.creatorForm.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/saveCreatorProfileCreationField',
      data: postData
    }
    // console.log("data",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.creatorForm.reset();
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.router.navigateByUrl('/creator_form');
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

  ngOnDestroy() {
    this.creatorForm.reset();
  }

}

