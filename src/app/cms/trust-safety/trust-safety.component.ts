import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trust-safety',
  templateUrl: './trust-safety.component.html',
  styleUrls: ['./trust-safety.component.scss']
})
export class TrustSafetyComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Trust & Safety Page', active: true }];
  }

}
