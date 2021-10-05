import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from '../../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  transHistory = [];
  payableAmount:any;
  modelName:any;
  addTransData:FormGroup;
  isEditTrans:any;
  transId:any;
  projectId:any;
  fileUpload: any;
  docUrl:any;

  constructor(
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private modalService: NgbModal,
  private route: ActivatedRoute,
  private spinner: NgxSpinnerService,
    private router: Router,) {
 }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Transactions List', active: true }];
    this.route.params.subscribe(params => this.projectId = params.id);

 this.addTransData = this.formBuilder.group({
      description: [''],
      payedAmount: [''],
      balancePayable: [''],
      document: [''],
    });
    this.fetchTransaction();
  }

  fetchTransaction(){
    let params = {
      url: "admin/getTransactionAdmin",
      projectId : this.projectId
    }  
    this.apiCall.projectLikedGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

       this.payableAmount = resu.data.payableAmount;
       this.modelName = resu.data.modelName;
        this.transHistory = resu.data.transactionHistory;

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
        // this.router.navigateByUrl('/projects');
      }
    },(error)=>{
       console.error(error);
       
    }); 
  }

  addTrans(transData: any){
    this.modalService.open(transData, { centered: true });

  }

  uploadImageFile(event){
    const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = file
      // console.log(this.filesToUpload)
    }

  onTransSubmit(){

    if(this.isEditTrans){
      this.transEditService(this.addTransData.value)
      return;
    }

    var postData = new FormData();

    postData.append('imageToStore', this.fileUpload);

    var params = {
      url: 'admin/postImagetoS3',
      data: postData
    }
    this.spinner.show();

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {

        if (response.body.error == false) {
              this.docUrl = response.body.data.Location

              const postData = this.addTransData.value;
    postData['document'] = this.docUrl;
    postData['projectId'] = this.projectId;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params1 = {
      url: 'admin/addTransactionAdmin',
      data: postData
    }

    this.apiCall.commonPostService(params1).subscribe(
      (response: any) => {
        if (response.body.error == false) {

          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.ngOnInit();
          this.modalService.dismissAll();
          this.spinner.hide();
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
          this.spinner.hide();
        }
      },
    )
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
          this.spinner.hide();
        }
      },
      (error) => {
        this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
        this.spinner.hide();
        console.log('Error', error)
      } 
    )
  }

  editTrans(data,transData:any){
    this.modalService.open(transData, { centered: true });

    this.isEditTrans = true;

    this.transId = data['_id']
    this.addTransData   = this.formBuilder.group({
      payedAmount: [data['payedAmount']],
      balancePayable: [data['balancePayable']],
      description: [data['description']],
    })
  }

  transEditService(data){
    data['projectId'] = this.projectId
    data['transactionId'] = this.transId;
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/editTransactionAdmin',
      data: data
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.isEditTrans = false;
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

  onDeleteTrans(id){
    const object = {}

    object['transactionId'] = id;
    object['projectId'] = this.projectId;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/deleteTransactionAdmin',
     data: object
   }
  //  console.log("da",params)
   this.apiCall.commonPostService(params).subscribe(
     (response: any) => {
       if (response.body.error == false) {
         // Success
         this.apiCall.showToast("Deleted Successfully", 'Success', 'successToastr')
         this.ngOnInit();
         this.modalService.dismissAll();
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
