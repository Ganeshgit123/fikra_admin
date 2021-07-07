import { Component, OnInit,Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormData } from 'form-data';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input()formData: FormData[];
  form: FormGroup;
  submitted: boolean;

  constructor() { }

  ngOnInit(): void {
    const formGroup = {};
    this.formData.forEach(formControl => {
      formGroup[formControl.controlName] = new FormControl('');
    });

  
    this.form = new FormGroup(formGroup);
console.log("dad",this.form)
  }

  submitForm() {
    this.submitted = true;
  }

}