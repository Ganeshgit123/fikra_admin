import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-start-banner',
  templateUrl: './start-banner.component.html',
  styleUrls: ['./start-banner.component.scss']
})
export class StartBannerComponent implements OnInit {
  bannerLeftCont: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
    this.bannerLeftCont = this.formBuilder.group({
      banTitleEn: [''],
      banDescriptionEn: [''],
      banTitleAr: [''],
      banDescriptionAr: [''],
      buttonNameEN: [''],
      buttonNameAr: [''],
      buttonLink: [''],
    });
  }


  bannerCont(){

  }

}
