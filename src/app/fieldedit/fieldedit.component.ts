import { Component, OnInit } from '@angular/core';

import { MockForm } from './dynamic-form/mock-form';

@Component({
  selector: 'app-fieldedit',
  templateUrl: './fieldedit.component.html',
  styleUrls: ['./fieldedit.component.scss']
})
export class FieldeditComponent implements OnInit {
  data = MockForm;
  constructor() { }

  ngOnInit(): void {
    const formGroup = {};
   
  }

}
