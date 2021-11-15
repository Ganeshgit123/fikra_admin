import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-serve',
  templateUrl: './template-serve.component.html',
  styleUrls: ['./template-serve.component.scss']
})
export class TemplateServeComponent implements OnInit {
  
  @Input('DataTemplete') DataTemplete: any;
  tempcont = [];
  article:any;
  constructor() { }

  ngOnInit(): void {
    this.tempcont = this.DataTemplete.content
    this.article = this.DataTemplete.blogContent
    // console.log("tmmm",this.DataTemplete)
  }

}
