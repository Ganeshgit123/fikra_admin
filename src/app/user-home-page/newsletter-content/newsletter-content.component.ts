import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $:any;

@Component({
  selector: 'app-newsletter-content',
  templateUrl: './newsletter-content.component.html',
  styleUrls: ['./newsletter-content.component.scss']
})
export class NewsletterContentComponent implements OnInit {
  addNewsLetter: FormGroup;
  updatedby:any;
  role:any;
  
  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addNewsLetter = this.formBuilder.group({
      newsHeading: [''],
      newsPara: [''],
    });
  }

  onSubmit(){
    
  }

}
