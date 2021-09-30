import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-start-a-project',
  templateUrl: './start-a-project.component.html',
  styleUrls: ['./start-a-project.component.scss']
})
export class StartAProjectComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Home Page', active: true }];

  }

}
