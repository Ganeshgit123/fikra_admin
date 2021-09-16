import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {
  updatedby:any;
  role:any;
  addPromotionContent: FormGroup;
  addPromotionFieildData:FormGroup;
  fieldDataList:any;
  isEdit = false;
  feildId:any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addPromotionContent = this.formBuilder.group({
      tabName: [''],
      tabName_Ar: [''],
      tabHead: [''],
      tabHead_Ar: [''],
      description: [''],
      description_Ar: [''],
    });

    this.addPromotionFieildData = this.formBuilder.group({
      feildHead: [''],
      feildHead_Ar: [''],
      feildDescription: [''],
      feildDescription_Ar: [''],
      feildMessage: [''],
      feildMessage_Ar: [''],
    });

    this.fetchBasicsData();

  }

  fetchBasicsData(){
    let params = {
      url: "admin/getProjectPromotionContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.addPromotionContent = this.formBuilder.group({
          tabName: [resu.data.tabName,[]],
          tabName_Ar: [resu.data.tabName_Ar,[]],
          tabHead: [resu.data.tabHead,[]],
          tabHead_Ar: [resu.data.tabHead_Ar,[]],
          description: [resu.data.description,[]],
          description_Ar: [resu.data.description_Ar,[]],
        });

        this.fieldDataList = resu.data.fields;


      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onSubmit(){
    const postData = this.addPromotionContent.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postProjectPromotionPage_CMS',
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

  addPromotionFields(promotionField: any){
    this.modalService.open(promotionField, { centered: true });
  }

  onPromotionFieldSubmit(){

    if(this.isEdit){
      this.promotionFieldEditService(this.addPromotionFieildData.value)
      return;
    }

    const postData = this.addPromotionFieildData.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;
    postData['tabId'] = '_promotion_';

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


  viewPromotionField(data,basicField: any){
    this.modalService.open(basicField, { centered: true });
    this.isEdit = true;
    this.feildId = data['_id'];

    this.addPromotionFieildData   = this.formBuilder.group({
      feildHead: [data['feildHead']],
      feildHead_Ar: [data['feildHead_Ar']],
      feildDescription: [data['feildDescription']],
      feildDescription_Ar: [data['feildDescription_Ar']],
      feildMessage: [data['feildMessage']],
      feildMessage_Ar: [data['feildMessage_Ar']],
    })
  }

  promotionFieldEditService(data){

    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['feildId'] = this.feildId;
    data['tabId'] = '_promotion_';


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

  onDeletePromotionField(id){
    const object = {}

    object['feildId'] = id; 
    object['tabId'] = '_promotion_'; 
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
