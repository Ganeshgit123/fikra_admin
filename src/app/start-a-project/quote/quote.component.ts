import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit {
  quote: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {

    this.quote = this.formBuilder.group({
      quoteDescriptionEn: [''],
      quoteAuthorEn: [''],
      quoteDescriptionAr: [''],
      quoteAuthorAr: [''],
    });
  }
  bannerCont(){

  }
}
