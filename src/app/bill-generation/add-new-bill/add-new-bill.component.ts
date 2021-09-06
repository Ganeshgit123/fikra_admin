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
  chargeSetting:any;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Billing' },{ label: 'Add New Bill', active: true }];
    this.addNewBill = this.formBuilder.group({
      userId: '',
      projectId: '',
      includes: this.formBuilder.array([
        this.getIncludeValues()
      ]),
      dueAmount: '',
      dueDate: '',
      totalAmount: '',
      processing_Fees_Percent: '',
      processing_Fees: '',
      VAT_Percent: '',
      VAT: '',
      paymentModel_Percent: '',
      paymentModel: '',
      discount: '',
    });

    this.fetchCommissionData();
  }

  private getIncludeValues() {
    return this.formBuilder.group({
      description: [''],
      quantity:[''],
      unitPrice: [''],
      total: [this.qty * this.unitPrice],
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


  fetchCommissionData(){
    let params = {
      url: "admin/getAllChargesList",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.chargeSetting = resu.data;

        this.addNewBill = this.formBuilder.group({
          processing_Fees_Percent: [resu.data.processing_Fees,[]],
          VAT_Percent: [resu.data.VAT,[]],
          includes: this.formBuilder.array([
            this.getIncludeValues()
          ]),
        });

          // console.log("data",this.chargeSetting)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }


  onSubmit(){
    
  }

}
