import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-category-sub-category',
  templateUrl: './category-sub-category.component.html',
  styleUrls: ['./category-sub-category.component.scss']
})
export class CategorySubCategoryComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  addNewCategory:FormGroup;
  addNewSubCategory:FormGroup;
  addNewCountry:FormGroup;
  addNewCity:FormGroup;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Settings' }, { label: 'Add Category', active: true }];

    this.addNewCategory = this.formBuilder.group({
      categoryName: [''],
    });

    this.addNewSubCategory = this.formBuilder.group({
      selectCategoryName: [''],
      subCategoryName: [''],
    });

    this.addNewCountry = this.formBuilder.group({
      countryName: [''],
    });

    this.addNewCity = this.formBuilder.group({
      selectCountry: [''],
      cityName: [''],
    });

  }

  addCategory(centerDataModal: any){
    this.modalService.open(centerDataModal, { centered: true });
  }

  addSubCategory(subCategoryModal: any){
    this.modalService.open(subCategoryModal, { centered: true });
  }

  addCountry(countryModal: any){
    this.modalService.open(countryModal, { centered: true });
  }

  addCity(cityModal: any){
    this.modalService.open(cityModal, { centered: true });
  }

  
  onSubmit(){

  }

}
