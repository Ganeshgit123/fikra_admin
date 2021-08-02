import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder,FormArray,FormControl  } from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';

@Component({
  selector: 'app-add-new-create-field',
  templateUrl: './add-new-create-field.component.html',
  styleUrls: ['./add-new-create-field.component.scss']
})
export class AddNewCreateFieldComponent implements OnInit {

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
    this.breadCrumbItems = [{ label: 'Field Edit' },{ label: 'New Field', active: true }];
    this.creatorForm = this.formBuilder.group({
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


    this.apiCall.createFieldEditFn.subscribe(result => {
      if(result != '0'){
        if(result['isEdit'] === true){
          this.isEdit = true;
          this.showAccept = true;
          this.editCreateField(result)
        } else {
          this.isEdit = false;
          this.creatorForm.reset();
        }
        
        }
      }, err => {
      console.log(err);
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

  public editCreateField(data){
    console.log("edit",data)


    this.ffiedId = data['_id'] 

    var dropDownValue = data['dropDown']
    var dropDownArray = []

    if(dropDownValue.length > 0){
      for(var i=0; i < dropDownValue.length; i++){
        dropDownArray.push(this.dropDownEditArray(dropDownValue[i]))
      }
    }

    this.creatorForm = this.formBuilder.group({
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
    // console.log(this.creatorForm.value);

    if(this.isEdit){
      this.fieldEditService(this.creatorForm.value)
      return;
    }

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
          this.router.navigateByUrl('/form-field-edit');
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

  fieldEditService(data){

    data['dataId'] = this.ffiedId;
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/updateCreatorProfileCreationField',
      data: data
    }

    // console.log("par",params)
    this.apiCall.commonPutService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.creatorForm.reset();
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.isEdit = false;
          this.router.navigateByUrl('/form-field-edit');
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

