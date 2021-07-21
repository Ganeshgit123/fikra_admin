import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-video-section',
  templateUrl: './video-section.component.html',
  styleUrls: ['./video-section.component.scss']
})
export class VideoSectionComponent implements OnInit {
  video: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {

    this.video = this.formBuilder.group({
      videoHeadEn: [''],
      videoDescriptionEn: [''],
      videoHeadAr: [''],
      videoDescriptionAr: [''],
      videoLink: [''],
    });

  }

  bannerCont(){

  }

}
