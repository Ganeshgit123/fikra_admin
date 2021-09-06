import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder,FormArray,FormControl  } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-add-new-bill',
  templateUrl: './add-new-bill.component.html',
  styleUrls: ['./add-new-bill.component.scss']
})
export class AddNewBillComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  addNewBill: FormGroup;
  includes:any;
  qty:any;
  unitPrice:any;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Billing' },{ label: 'Add New Bill', active: true }];
    this.addNewBill = this.formBuilder.group({
      includes: this.formBuilder.array([
        this.getIncludeValues()
      ]),
    });
  }

  private getIncludeValues() {
    return this.formBuilder.group({
      description: [''],
      quantity:[''],
      unitPrice: [''],
      total: [''],
    })
  }

  addOptions(){
    let control = <FormArray>this.addNewBill.controls.includes;
    control.push(
      this.formBuilder.group({
        description: [''],
      quantity:[''],
      unitPrice: [''],
      total: [''],
      })
    )
  }

  deleteOptions(index){
    let control = <FormArray>this.addNewBill.controls.includes;
    control.removeAt(index)
  }

  onQty(event:any){
    this.qty = event.target.value ;
  }

  onUnitPrice(event:any){
    this.unitPrice = event.target.value ;
  }

  

  onSubmit(){
    
  }

}
