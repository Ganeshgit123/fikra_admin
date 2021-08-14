import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-creator-handbook',
  templateUrl: './creator-handbook.component.html',
  styleUrls: ['./creator-handbook.component.scss']
})
export class CreatorHandbookComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  imagePreview = null;
  fileUpload: any;
  addHandbook:FormGroup;
  gettingStarted:FormGroup;

  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
 }

  
  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Creator Handbook', active: true }];

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addHandbook = this.formBuilder.group({
      headEn: [''],
      descriptionEn: [''],
      headAr: [''],
      descriptionAr: [''],
      title1En:[''],
      title1Ar:[''],
      title2En:[''],
      title2Ar:[''],
      title3En:[''],
      title3Ar:[''],
      title4En:[''],
      title4Ar:[''],
      title5En:[''],
      title5Ar:[''],
      title6En:[''],
      title6Ar:[''],
      title7En:[''],
      title7Ar:[''],
      title8En:[''],
      title8Ar:[''],
    });


    this.gettingStarted = this.formBuilder.group({
      bannerImage: [''],
      contentEn: [''],
      contentAr: [''],
    });


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

  onGettingUpdate(){
    
  }

}
