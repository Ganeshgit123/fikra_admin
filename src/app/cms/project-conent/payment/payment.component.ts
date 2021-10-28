import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  updatedby:any;
  role:any;
  addPaymentContent: FormGroup;
  addPaymentFieildData:FormGroup;
  fieldDataList:any;
  isEdit = false;
  feildId:any;
  searchTerm;
  showAccept = true;
  page = 1;
  total: any;

   constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addPaymentContent = this.formBuilder.group({
      tabName: [''],
      tabName_Ar: [''],
      tabHead: [''],
      tabHead_Ar: [''],
      description: [''],
      description_Ar: [''],
    });

    this.addPaymentFieildData = this.formBuilder.group({
      feildHead: [''],
      feildHead_Ar: [''],
      feildDescription: [''],
      feildDescription_Ar: [''],
      feildMessage: [''],
      feildMessage_Ar: [''],
    });

    this.fetchBasicsData();
    this.callRolePermission();
  }
  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }
  fetchBasicsData(){
    let params = {
      url: "admin/getProjectPaymentContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.addPaymentContent = this.formBuilder.group({
          tabName: [resu.data.tabName,[]],
          tabName_Ar: [resu.data.tabName_Ar,[]],
          tabHead: [resu.data.tabHead,[]],
          tabHead_Ar: [resu.data.tabHead_Ar,[]],
          description: [resu.data.description,[]],
          description_Ar: [resu.data.description_Ar,[]],
        });

        this.fieldDataList = resu.data.fields;
        this.total = this.fieldDataList.length

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onSubmit(){
    const postData = this.addPaymentContent.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postProjectPaymentPage_CMS',
      data: postData
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.ngOnInit();
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

  addPaymentFields(paymentField: any){
    this.addPaymentFieildData.reset();
    this.modalService.open(paymentField, { centered: true });
  }

  onPaymentFieldSubmit(){

    if(this.isEdit){
      this.paymentFieldEditService(this.addPaymentFieildData.value)
      return;
    }

    const postData = this.addPaymentFieildData.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;
    postData['tabId'] = '_payment_';

    var params = {
      url: 'admin/pushFeildDetails',
      data: postData
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.modalService.dismissAll();
         this.ngOnInit();
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


  viewPaymentField(data,paymentField: any){
    this.modalService.open(paymentField, { centered: true });
    this.isEdit = true;
    this.feildId = data['_id'];

    this.addPaymentFieildData   = this.formBuilder.group({
      feildHead: [data['feildHead']],
      feildHead_Ar: [data['feildHead_Ar']],
      feildDescription: [data['feildDescription']],
      feildDescription_Ar: [data['feildDescription_Ar']],
      feildMessage: [data['feildMessage']],
      feildMessage_Ar: [data['feildMessage_Ar']],
    })
  }

  paymentFieldEditService(data){

    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['feildId'] = this.feildId;
    data['tabId'] = '_payment_';


  var params = {
    url: 'admin/editFeildDetails',
    data: data
  }

   // console.log("ppp",params)
   this.apiCall.commonPostService(params).subscribe(
     (response: any) => {
       if (response.body.error == false) {
         // Success
         this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
         this.isEdit = false;
         this.modalService.dismissAll();
         this.ngOnInit();
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

  onDeletePaymentField(id){
    const object = {}

    object['feildId'] = id; 
    object['tabId'] = '_payment_'; 
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/removeFeildDetails',
     data: object
   }
  //  console.log("da",params)
   this.apiCall.commonPostService(params).subscribe(
     (response: any) => {
       if (response.body.error == false) {
         // Success
         this.apiCall.showToast("Deleted Successfully", 'Success', 'successToastr')
         this.ngOnInit();
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
