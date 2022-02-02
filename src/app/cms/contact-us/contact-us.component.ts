import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Form} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  addBranchData:FormGroup;
  branchData:any;
  isEdit = false;
  branchId:any;
  contactListData:any;
  showAccept = true;
  searchTerm;
  page = 1;
  total: any;
  searchTerm1;
  total1: any;

  addInquiryData:FormGroup;
  inquiryData = [];
  inquryTot:any;
  enquiryEdit = false;
  enquiryId:any;
  imagePreview = null;
  fileUpload: any;
  imgUrl:any;
  
  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Contact' },{ label: 'contact Details', active: true }];
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addBranchData = this.formBuilder.group({
      address: [''],
      addressAr: [''],
      email: [''],
      fax: [''],
      phone: [''],
      branchImage: [''],
      mapURL: [''],
    });

    this.addInquiryData = this.formBuilder.group({
      enquiryName: [''],
      enquiryName_Ar: [''],
    });

    this.fetchBranchData();
    this.inquiryList();
    this.fetchContactListData();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchBranchData(){
    let params = {
      url: "admin/getBranchDetails",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.imagePreview = resu.data[0].branchImage;
        this.addBranchData = this.formBuilder.group({
          address: [resu.data[0].address,[]],
          addressAr: [resu.data[0].addressAr,[]],
          email: [resu.data[0].email,[]],
          fax: [resu.data[0].fax,[]],
          phone: [resu.data[0].phone,[]],
          mapURL: [resu.data[0].mapURL,[]],
          branchImage: ['']
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  removeImg(){
    this.imagePreview = "";
  }

  uploadImageFile(event){
    const file = event.target.files && event.target.files[0];
    var valid = this.checkFileFormat(event.target.files[0]);
    if(!valid) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = file
      // console.log("img",this.fileUpload)
    }
  }


  checkFileFormat(checkFile){
    if(checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'image/TIF' || checkFile.type == 'image/tif' || checkFile.type == 'image/tiff'){
      return false;
    } else {
      return true;
    }
  }

  onSubmit(){
    if(this.fileUpload){
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
                this.imgUrl = response.body.data.Location
                    const data = this.addBranchData.value;
                    data['branchImage'] = this.imgUrl;
                    data['branchId'] = "6163dfd33e9ee3b0e3ac5818";
                    data['createdBy'] = this.updatedby;
                    data['userType'] = "admin";
                    data['role'] = this.role;
                  
                  var params1 = {
                  url: 'admin/updateBranch',
                  data: data
                  }
                  this.apiCall.commonPostService(params1).subscribe(
                  (response: any) => {
                  if (response.body.error == false) {
                  
                  this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
                  this.imagePreview = null;
                  this.ngOnInit();
                  this.spinner.hide();
                  } else {
                  this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
                  }
                  },
                  (error) => {
                  this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
                  this.spinner.hide();
                  console.log('Error', error)
                  } 
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
      }else{
        const data = this.addBranchData.value;
        data['branchImage'] = this.imagePreview;
        data['branchId'] = "6163dfd33e9ee3b0e3ac5818";
        data['createdBy'] = this.updatedby;
        data['userType'] = "admin";
        data['role'] = this.role;
      
      var params1 = {
      url: 'admin/updateBranch',
      data: data
      }
      this.apiCall.commonPostService(params1).subscribe(
      (response: any) => {
      if (response.body.error == false) {
      
      this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
      this.imagePreview = null;
      this.ngOnInit();
      this.spinner.hide();
      } else {
      this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
      }
      },
      (error) => {
      this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      this.spinner.hide();
      console.log('Error', error)
      } 
      )
      }
    
  }

  fetchContactListData(){
    let params = {
      url: "admin/getContactMessage",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.contactListData = resu.data;
        this.total1 = this.contactListData.length

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  addInquiry(InquiryCorner: any){
    this.addInquiryData.reset();
    this.enquiryEdit = false;
    this.modalService.open(InquiryCorner, { centered: true });
  }

  onInquirySubmit(){

    if(this.enquiryEdit){
      this.InquiryEditService(this.addInquiryData.value)
      return;
    }

    const postData = this.addInquiryData.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/addNewEnquiry',
      data: postData
    }
    // console.log("fefe",params)
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

  inquiryList(){
    let params = {
      url: "admin/getAllEnquiry",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.inquiryData = resu.data;
        this.inquryTot = resu.data.length
        // console.log("tt",this.total)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  viewInquiry(data,InquiryCorner: any){
    this.modalService.open(InquiryCorner, { centered: true });

    this.enquiryEdit = true;

    this.enquiryId = data['_id']
    this.addInquiryData   = this.formBuilder.group({
      enquiryName: [data['enquiryName']],
      enquiryName_Ar: [data['enquiryName_Ar']],
    })
  }

  InquiryEditService(data){
    data['enquiryId'] = this.enquiryId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/editEnquiryData',
      data: data
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.enquiryEdit = false;
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

  onDeleteEnquiry(id){
    const object = {}

    object['enquiryId'] = id;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/deleteEnquiryData',
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
