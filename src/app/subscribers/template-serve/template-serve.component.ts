import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-serve',
  templateUrl: './template-serve.component.html',
  styleUrls: ['./template-serve.component.scss']
})
export class TemplateServeComponent implements OnInit {
  
  @Input('DataTemplete') DataTemplete: string;

  constructor() { }

  ngOnInit(): void {
  }

}
