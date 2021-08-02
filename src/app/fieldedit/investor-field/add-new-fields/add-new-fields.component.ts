import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder,FormArray,FormControl  } from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';

@Component({
  selector: 'app-add-new-fields',
  templateUrl: './add-new-fields.component.html',
  styleUrls: ['./add-new-fields.component.scss']
})
export class AddNewFieldsComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');

  empForm: FormGroup;
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
    this.breadCrumbItems = [{ label: 'Field Edit' },{ label: 'New Field', active: true }];
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

  public editProducts(data){
    console.log("edit",data)

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
      fieldType: [data['fieldType']],
      placeholder: [data['placeholder']],
      fieldId: [data['fieldId']],
      _is_Mandatory_:[data['_is_Mandatory_']],
      defauldValue:[data['defauldValue']],
      description:[data['description']],
      fieldInputType:[data['fieldInputType']],
      dropDown: this.formBuilder.array(dropDownArray),
    });

  }

  dropDownEditArray(obj): FormGroup{
    // console.log("droparray",obj)
    return this.formBuilder.group({
      displayName: [obj.displayName],
      value: [obj.value],
    })
  }


  onSubmit() {
    // console.log(this.empForm.value);

    if(this.isEdit){
      this.fieldEditService(this.empForm.value)
      return;
    }

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
          this.router.navigateByUrl('/form-field-edit');
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
          this.router.navigateByUrl('/form-field-edit');
          window.location.reload();
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

