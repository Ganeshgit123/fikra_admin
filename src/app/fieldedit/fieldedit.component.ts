import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-fieldedit',
  templateUrl: './fieldedit.component.html',
  styleUrls: ['./fieldedit.component.scss']
})
export class FieldeditComponent implements OnInit {


  breadCrumbItems: Array<{}>;

  constructor( ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [{ label: 'Form Field List', active: true }];

  }



}