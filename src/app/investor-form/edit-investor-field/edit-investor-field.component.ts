import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder,FormArray,FormControl  } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-edit-investor-field',
  templateUrl: './edit-investor-field.component.html',
  styleUrls: ['./edit-investor-field.component.scss']
})
export class EditInvestorFieldComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  empForm: FormGroup;
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
    this.breadCrumbItems = [{ label: 'Investor Signup Form' },{ label: 'Edit Field', active: true }];

    this.apiCall.fieldEditFn.subscribe(result => {
      if(result != '0'){
        if(result['isEdit'] === true){
          this.isEdit = true;
          this.showAccept = true;
          this.editProducts(result)
        } else {
          this.isEdit = false;
          this.empForm.reset();
        }
        
        }
      }, err => {
      console.log(err);
    });
  }

  public editProducts(data){
    // console.log("edit",data)

    this.ffiedId = data['_id'] 

    var dropDownValue = data['dropDown']
    var dropDownArray = []

    if(dropDownValue.length > 0){
      for(var i=0; i < dropDownValue.length; i++){
        dropDownArray.push(this.dropDownEditArray(dropDownValue[i]))
      }
    }


    this.empForm = this.formBuilder.group({
      fieldName: [data['fieldName']],
      arabicFieldName: [data['arabicFieldName']],
      fieldType: [data['fieldType']],
      placeholder: [data['placeholder']],
      arabicPlaceholder: [data['arabicPlaceholder']],
      fieldId: [data['fieldId']],
      _is_Mandatory_:[data['_is_Mandatory_']],
      defauldValue:[data['defauldValue']],
      description:[data['description']],
      fieldInputType:[data['fieldInputType']],
      dropDown: this.formBuilder.array(dropDownArray),
    });

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


  dropDownEditArray(obj): FormGroup{
    // console.log("droparray",obj)
    return this.formBuilder.group({
      displayName: [obj.displayName],
      value: [obj.value],
    })
  }

  onSubmit(){
    if(this.isEdit){
      this.fieldEditService(this.empForm.value)
      return;
    }

  }

  fieldEditService(data){

    data['dataId'] = this.ffiedId;
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/updateUserProfileCreationField',
      data: data
    }

    // console.log("par",params)
    this.apiCall.commonPutService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.empForm.reset();
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.isEdit = false;
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
  // ngOnDestroy() {
  //   this.empForm.reset();
  // }


}