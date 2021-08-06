import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder,FormArray,FormControl  } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-add-investor-field',
  templateUrl: './add-investor-field.component.html',
  styleUrls: ['./add-investor-field.component.scss']
})
export class AddInvestorFieldComponent implements OnInit {

  breadCrumbItems: Array<{}>;

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');

  empForm: FormGroup;
  dropDown:any;

  showAccept = false;
  ffiedId:any;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Investor Signup Form' },{ label: 'Add New Field', active: true }];
    this.empForm = this.formBuilder.group({
      fieldName: '',
      fieldType: '',
      placeholder: '',
      fieldId: '',
      _is_Mandatory_: '',
      defauldValue:'',
      description:'',
      fieldInputType:'',
      dropDown: this.formBuilder.array([
        this.getdropdownValues()
      ]),
    });


    // this.dropDown = this.empForm.controls.dropDown.value

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
    let control = <FormArray>this.empForm.controls.dropDown;
    control.push(
      this.formBuilder.group({
        displayName: [''],
        value: [''],
      })
    )
  }

  deleteOptions(index){
    let control = <FormArray>this.empForm.controls.dropDown;
    control.removeAt(index)
  }

  

  onSubmit() {
    // console.log(this.empForm.value);
    const postData = this.empForm.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/saveUserProfileCreationField',
      data: postData
    }
    // console.log("data",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.empForm.reset();
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.ngOnInit();
          this.router.navigateByUrl('/investor_form');
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
    this.empForm.reset();
  }

}

