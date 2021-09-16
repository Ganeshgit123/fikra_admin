import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-conent',
  templateUrl: './project-conent.component.html',
  styleUrls: ['./project-conent.component.scss']
})
export class ProjectConentComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Project Details Add Page', active: true }];

  }

}
