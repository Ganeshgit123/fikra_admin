import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $:any;

@Component({
  selector: 'app-featured-takingoff',
  templateUrl: './featured-takingoff.component.html',
  styleUrls: ['./featured-takingoff.component.scss']
})
export class FeaturedTakingoffComponent implements OnInit {
  updatedby:any;
  role:any;
  addFeatured: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }


  ngOnInit(): void {

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');


    this.addFeatured = this.formBuilder.group({
      featureContent: [''],
      takingOffContent: [''],
    });

  }


  onSubmit(){

  }

}
