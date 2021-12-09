import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-what-we-do',
  templateUrl: './what-we-do.component.html',
  styleUrls: ['./what-we-do.component.scss']
})
export class WhatWeDoComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'What We Do Page', active: true }];
  }

}
