import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss']
})
export class UserHomePageComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  bannerLeftCont: FormGroup;
  addBannerImg: FormGroup;
  addNewsLetter: FormGroup;
  addFeatured: FormGroup;
  addCreatorData: FormGroup;
  addClientLogo: FormGroup;
  addFooterCont: FormGroup;
  imagePreview = null;
  fileUpload: any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Home Page', active: true }];

    this.bannerLeftCont = this.formBuilder.group({
      fistContent: ['',  [Validators.required, Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]],
    });

    this.addBannerImg = this.formBuilder.group({
      bannerPic: [''],
    });

    this.addNewsLetter = this.formBuilder.group({
      newsHeading: [''],
      newsPara: [''],
    });

    this.addFeatured = this.formBuilder.group({
      featureContent: [''],
      takingOffContent: [''],
    });

    this.addCreatorData = this.formBuilder.group({
      creatorImg: [''],
      creatHead: [''],
      creatDesc: [''],
      creatLink: [''],
    });

    this.addClientLogo = this.formBuilder.group({
      clientImg: [''],
    });

    this.addFooterCont = this.formBuilder.group({
      footerHead: [''],
      footerDesc: [''],
      footerLink: [''],
    });

    
  }


  addBannner(centerDataModal: any){
    this.modalService.open(centerDataModal, { centered: true });

  }

  addCreators(creatorCorner: any){
    this.modalService.open(creatorCorner, { centered: true });

  }
 
  uploadImageFile(event){
    var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = event.target.files[0]
  }


  bannerCont(){

  }

  onSubmit(){

  }

}
