import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,FormArray,FormControl  } from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';

@Component({
  selector: 'app-add-new-fields',
  templateUrl: './add-new-fields.component.html',
  styleUrls: ['./add-new-fields.component.scss']
})
export class AddNewFieldsComponent implements OnInit {

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');

  empForm: FormGroup;
  dropDown:any;
  selected;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.empForm = this.formBuilder.group({
      fieldName: '',
      fieldType: '',
      placeholder: '',
      fieldId: '',
      _is_Mandatory_: '',
      defauldValue:'',
      description:'',
      dropDown: this.formBuilder.array([
        this.getdropdownValues()
      ]),
    });
    this.dropDown = this.empForm.controls.dropDown.value

    // this.fetchFieldData();

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

  // employees(): FormArray {
  //   return this.empForm.get('employees') as FormArray;
  // }

  // newEmployee(): FormGroup {
  //   return this.formBuilder.group({
  //     fieldName: '',
  //     fieldType: '',
  //     placeholder: '',
  //     skills: this.formBuilder.array([])
  //   });
  // }

  // addEmployee() {
  //   this.employees().push(this.newEmployee());
  // }

  // removeEmployee(empIndex: number) {
  //   this.employees().removeAt(empIndex);
  // }

  // employeeSkills(empIndex: number): FormArray {
  //   return this.employees()
  //     .at(empIndex)
  //     .get('skills') as FormArray;
  // }

  // newSkill(): FormGroup {
  //   return this.formBuilder.group({
  //     skill: '',
  //     exp: ''
  //   });
  // }

  // addEmployeeSkill(empIndex: number) {
  //   this.employeeSkills(empIndex).push(this.newSkill());
  // }

  // removeEmployeeSkill(empIndex: number, skillIndex: number) {
  //   this.employeeSkills(empIndex).removeAt(skillIndex);
  // }

  onSubmit() {
    // console.log(this.empForm.value);
  }

}

