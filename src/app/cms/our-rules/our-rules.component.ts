import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-our-rules',
  templateUrl: './our-rules.component.html',
  styleUrls: ['./our-rules.component.scss']
})
export class OurRulesComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Our Rules Page', active: true }];
  }

}
