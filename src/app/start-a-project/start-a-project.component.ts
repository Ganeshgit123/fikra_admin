import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-start-a-project',
  templateUrl: './start-a-project.component.html',
  styleUrls: ['./start-a-project.component.scss']
})
export class StartAProjectComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  bannerLeftCont: FormGroup;
  quote: FormGroup;
  projectTitle: FormGroup;
  addQues: FormGroup;
  video: FormGroup;
  whyFikra: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Home Page', active: true }];

    this.bannerLeftCont = this.formBuilder.group({
      fistContent: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      descripContent: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    });

    this.quote = this.formBuilder.group({
      quoteDescription: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      quoteAuthor: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    });

    this.projectTitle = this.formBuilder.group({
      projTitle: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      projQues: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      projAns: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    });

    this.addQues = this.formBuilder.group({
      projQues: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      projAns: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    });

    this.video = this.formBuilder.group({
      videoLink: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      videoHead: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      videoDescription: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    });

    this.whyFikra = this.formBuilder.group({
      quesOne: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      answerOne: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      quesTwo: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      answerTwo: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      quesThree: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
      answerThree: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    });

  }

  addQuesAndAns(addQuesAns: any){
    this.modalService.open(addQuesAns, { centered: true });

  }


  bannerCont(){

  }

  onSubmit(){

  }

}
