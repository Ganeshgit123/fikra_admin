import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-project-q',
  templateUrl: './project-q.component.html',
  styleUrls: ['./project-q.component.scss']
})
export class ProjectQComponent implements OnInit {
  projectTitle: FormGroup;
  addQues: FormGroup;
  
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {

    this.projectTitle = this.formBuilder.group({
      projTitleEn: [''],
      projTitleAr: [''],
    });

    this.addQues = this.formBuilder.group({
      projQuesEn: [''],
      projQuesAr: [''],
      projAnsEn: [''],
      projAnsAr: [''],
    });

  }


  addQuesAndAns(addQuesAns: any){
    this.modalService.open(addQuesAns, { centered: true });

  }

  onSubmit(){

  }

  bannerCont(){

  }

}
