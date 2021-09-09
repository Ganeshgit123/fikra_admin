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
  processingFees:any;
  VatCharge:any;
  creatorsList = [];
  projectList = [];
  isSelectValue:any;
  isAllNothing:any;
  keepItAll:any;
  keepItPercentage:any;
  keepItCharge:any;
  serviceList = [];
  paymentPercentage:any;
  parmId:any
  projectId:any;
  serviceType:any;
  serviceId:any;
  isShow:any;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.parmId = params.id);
    
    var str = this.parmId
    var splitted = str.split("-"); 

    if(splitted[0] == 'proj'){
        this.projectId = splitted[1];
        this.serviceType = "project";
      this.isShow = true;
      this.projectSelectClick();
    }else if(splitted[0] == 'special'){
      this.serviceId = splitted[1];
      this.serviceType = "specialService";
      this.isShow = false;
      this.fetchCommonCharges();
    }
        //  console.log("service",splitted)

    this.breadCrumbItems = [{ label: 'Billing' },{ label: 'Add New Bill', active: true }];
    this.addNewBill = this.formBuilder.group({
      serviceType:[this.serviceType],
      userId: [''],
      projectId: [this.projectId],
      serviceId: [this.serviceId],
      includes: this.formBuilder.array([
        this.getIncludeValues()
      ]),
      dueAmount: [''],
      dueDate: [''],
      totalAmount: [''],
      processing_Fees_Percent: [''],
      processing_Fees: [''],
      VAT_Percent: [''],
      VAT: [''],
      paymentModel_Percent: [''],
      paymentModel: [''],
      discount: [''],
    });

    this.fetchCreatorsList();
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


  fetchCommissionData(val){
    let params = {
      url: "admin/getAllChargesList",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.chargeSetting = resu.data;
        
        this.processingFees = resu.data.processing_Fees *10/100;

        this.VatCharge = resu.data.VAT *10/100;
    
        if(val == 1){
            this.keepItPercentage = resu.data.keepItAllCommission
        }else if(val == 0){
          this.keepItPercentage = resu.data.allAreNothingCommission
        }

          console.log("all",this.isAllNothing)
         console.log("kok",this.keepItAll)

        this.keepItCharge = this.keepItPercentage *10/100;
          // console.log("per",this.keepItPercentage)
        this.addNewBill = this.formBuilder.group({
          processing_Fees_Percent: [resu.data.processing_Fees,[]],
          VAT_Percent: [resu.data.VAT,[]],
          processing_Fees: [this.processingFees,[]],
          VAT: [this.VatCharge,[]],
          includes: this.formBuilder.array([
            this.getIncludeValues()
          ]),
          userId: [''],
      projectId: [this.projectId],
      serviceType:[this.serviceType],
      serviceId: [this.serviceId],
      dueAmount: [''],
      dueDate: [''],
      totalAmount: [''],

      paymentModel_Percent: [this.keepItPercentage,[]],
      paymentModel: [this.keepItCharge,[]],
      discount: [''],

        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  fetchCommonCharges(){
    let params = {
      url: "admin/getAllChargesList",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.chargeSetting = resu.data;
        
        this.processingFees = resu.data.processing_Fees *10/100;

        this.VatCharge = resu.data.VAT *10/100;
    
      
          // console.log("per",this.keepItPercentage)
        this.addNewBill = this.formBuilder.group({
          processing_Fees_Percent: [resu.data.processing_Fees,[]],
          VAT_Percent: [resu.data.VAT,[]],
          processing_Fees: [this.processingFees,[]],
          VAT: [this.VatCharge,[]],
          includes: this.formBuilder.array([
            this.getIncludeValues()
          ]),
          userId: [''],
      projectId: [this.projectId],
      serviceType:[this.serviceType],
      serviceId: [this.serviceId],
      dueAmount: [''],
      dueDate: [''],
      totalAmount: [''],

      paymentModel_Percent: [''],
      paymentModel: [''],
      discount: [''],

        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  fetchCreatorsList(){
    let params = {
      url: "admin/getCreatorList",
    }  
    this.apiCall.subCommonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.creatorsList = resu.data;
   
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  projectSelectClick(){
    let params = {
      url: "admin/getProjectListById",
      projectId : this.projectId
    }  
// console.log("pr",params)
    this.apiCall.projectGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
         this.isAllNothing = resu.data._is_All_Nothing_;
         this.keepItAll = resu.data._is_Keep_It_All_;
     
         if(this.isAllNothing == true){
           this.paymentPercentage = 0
         }else if (this.keepItAll == true){
          this.paymentPercentage = 1
         }

         this.fetchCommissionData(this.paymentPercentage);

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }



  onSubmit(){
       const postData = this.addNewBill.value;
       postData['createdBy'] = this.updatedby;
       postData['userType'] = "admin";
       postData['role'] = this.role;
   
       var params = {
         url: 'admin/makeBillForUser',
         data: postData
       }
       console.log("data",params)
       this.apiCall.commonPostService(params).subscribe(
         (response: any) => {
           if (response.body.error == false) {
             this.addNewBill.reset();
             this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
             this.ngOnInit();
             this.router.navigateByUrl('/bill_list');
           } else {
             // Query Error
             this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
           }
         },
         (error) => {
           this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
           console.log('Error', error)
         } 
       )
  }

}
