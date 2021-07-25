import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-sub-category',
  templateUrl: './category-sub-category.component.html',
  styleUrls: ['./category-sub-category.component.scss']
})
export class CategorySubCategoryComponent implements OnInit {
  breadCrumbItems: Array<{}>;



  constructor(
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Add Category', active: true }];

  }

}
