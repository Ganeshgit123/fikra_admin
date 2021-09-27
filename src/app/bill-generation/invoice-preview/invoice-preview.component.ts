import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder,FormArray,FormControl  } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent implements OnInit {
  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  billId:any;
  billDetails:any;
  billAddress:any;
  invoDate:any;
  invoNo:any;
  billName:any;
  addressOne:any;
  addressTwo:any;
  city:any;
  state:any;
  pin:any;
  phone:any;
  billIncludes = [];
  totAmt:any;
  discount:any;
  discountTot:any;
  taxPercent:any;
  taxTotal:any;
  userSend:any;
  billingId:any;
  dueDays:any;
  billxdate:any;
  invoicedate:any;
  dueAmt:any;
  processFeeAmt:any;
  vatAmt:any;
  paymentAmt:any;

   constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.billId = params.id);
    this.billDetailbyId();
  }

  billDetailbyId(){
    let params = {
      url: "admin/getBillById",
      billId : this.billId
    }  
// console.log("pr",params)
    this.apiCall.billGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
         this.billDetails = resu.data;
         this.invoDate = this.billDetails.invoiceData;
         this.invoNo = this.billDetails.invoiceNo;
         this.dueAmt = this.billDetails.dueAmount;
         this.processFeeAmt = this.billDetails.processing_Fees;
         this.vatAmt = this.billDetails.VAT;
         this.paymentAmt = this.billDetails.paymentModel;
         this.discount = this.billDetails.discount;
         this.totAmt = this.billDetails.totalAmount; 

         this.userSend = this.billDetails._is_Sended_;
         this.billingId = this.billDetails._id;

         this.dueDays = this.billDetails.dueDate - this.billDetails.invoiceData

this.billxdate=new Date(this.billDetails.dueDate);
    this.invoicedate=new Date(this.billDetails.invoiceData);
    var Days = Math.abs(this.invoicedate - this.billxdate);
    this.dueDays = Math.ceil(Days / (1000 * 60 * 60 * 24));
    
         this.billAddress = resu.address;
        this.billName = this.billAddress.fullName;
        this.addressOne = this.billAddress.Address_one;
        this.addressTwo = this.billAddress.Address_two;
        this.city = this.billAddress.city;
        this.state = this.billAddress.state;
        this.pin = this.billAddress.pin;
        this.phone = this.billAddress.phone;

        this.billIncludes = resu.data.includes;

        //  console.log("bill",this.billIncludes)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  billSendSubmit(id){
    const object = {}
    object['billId'] = id
    object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

    var params = {
      url: 'admin/sendBillToUser',
      data: object
    }

    // console.log("par",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
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
