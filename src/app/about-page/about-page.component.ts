import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators, Form} from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  imagePreview = null;
  fileUpload: any;
  addprofile:FormGroup;
  addMissionCont:FormGroup;
  addVisionCont:FormGroup;

  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
 }

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'About Page', active: true }];

    this.addprofile   = this.formBuilder.group({
      profileContentEN: [''],
      profileContentAR: [''],
    })

    this.addMissionCont   = this.formBuilder.group({
      missionImage: [''],
      missionContentEn: [''],
      missionContentAr: [''],
    })

    this.addVisionCont   = this.formBuilder.group({
      visionImage: [''],
      visionContentEn: [''],
      visionContentAr: [''],
    })

  }

  uploadImageFile(event){
    var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = event.target.files[0]
  }

  onSubmit(){
    
  }
}
