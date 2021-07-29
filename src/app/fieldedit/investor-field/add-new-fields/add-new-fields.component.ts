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

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.empForm = this.formBuilder.group({
      fieldName: '',
      fieldType: '',
      placeholder: '',
      // employees: this.formBuilder.array([])
    });

    // this.fetchFieldData();

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

