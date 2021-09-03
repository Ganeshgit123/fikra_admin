import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  updatedby:any;
  role:any;
  addFaqData : FormGroup;
  faqData:any;
  isEdit = false;
  faqId:any;
  showAccept = true;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addFaqData = this.formBuilder.group({
      faq_Header: [''],
      faq_Header_ar: [''],
      faq_Body: [''],
      faq_Body_ar: [''],
    });

    this.fetchFaqData();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }
  
  fetchFaqData(){
    let params = {
      url: "admin/getAllFAQContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.faqData = resu.data;

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    }); 
  }

  addFaq(creatorCorner: any){
    this.modalService.open(creatorCorner, { centered: true });

  }

  viewFaq(data,creatorCorner: any){
    this.modalService.open(creatorCorner, { centered: true });

    this.isEdit = true;

    this.faqId = data['_id']
    this.addFaqData   = this.formBuilder.group({
      faq_Header: [data['faq_Header']],
      faq_Header_ar: [data['faq_Header_ar']],
      faq_Body: [data['faq_Body']],
      faq_Body_ar: [data['faq_Body_ar']],
    })
  }

  faqEditService(data){

    data['faqId'] = this.faqId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['_is_Deleted_'] = false;
    data['_is_visible_'] = true;

    var params = {
      url: 'admin/updateFAQContent',
      data: data
    }
    this.apiCall.commonPutService(params).subscribe(
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

  onSubmit(){

    if(this.isEdit){
      this.faqEditService(this.addFaqData.value)
      return;
    }

    const postData = this.addFaqData.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/saveFAQContents',
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

  onchangeFaqStatus(values:any,val){

    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['faqId'] = val;
     object['_is_visible_'] = visible;
     object['_is_Deleted_'] = false;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/updateFAQStatus',
      data: object
    }
    this.apiCall.commonPutService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast("Changed Successfully", 'Success', 'successToastr')
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

  onDeleteFaqStatus(val,id,visible){
    const object = {}

    object['faqId'] = id;
    object['_is_visible_'] = visible;
    object['_is_Deleted_'] = val;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/updateFAQStatus',
     data: object
   }
  //  console.log("da",params)
   this.apiCall.commonPutService(params).subscribe(
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
