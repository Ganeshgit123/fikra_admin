import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-country-city',
  templateUrl: './country-city.component.html',
  styleUrls: ['./country-city.component.scss']
})
export class CountryCityComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Add Country', active: true }];

  }

}
