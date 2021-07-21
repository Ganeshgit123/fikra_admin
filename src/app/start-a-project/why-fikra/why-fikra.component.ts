import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-why-fikra',
  templateUrl: './why-fikra.component.html',
  styleUrls: ['./why-fikra.component.scss']
})
export class WhyFikraComponent implements OnInit {
  whyFikra: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {

    this.whyFikra = this.formBuilder.group({
      whyHeadEn: [''],
      quesOneEn: [''],
      answerOneEn: [''],
      quesTwoEn: [''],
      answerTwoEn: [''],
      quesThreeEn: [''],
      answerThreeEn: [''],
      whyHeadAr: [''],
      quesOneAr: [''],
      answerOneAr: [''],
      quesTwoAr: [''],
      answerTwoAr: [''],
      quesThreeAr: [''],
      answerThreeAr: [''],
  
    });
  }


  bannerCont(){

  }

}
