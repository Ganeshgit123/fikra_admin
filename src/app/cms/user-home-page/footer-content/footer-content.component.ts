import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $:any;

@Component({
  selector: 'app-footer-content',
  templateUrl: './footer-content.component.html',
  styleUrls: ['./footer-content.component.scss']
})
export class FooterContentComponent implements OnInit {
  updatedby:any;
  role:any;
  addFooterCont: FormGroup;
  showAccept = true;
  addFooterLabelData: FormGroup;
  footerLable:any;
  isEdit = false;
  labelContId:any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');


    this.addFooterCont = this.formBuilder.group({
      header: [''],
      header_ar: [''],
      discription: [''],
      discription_ar: [''],
      buttonName: [''],
      buttonName_ar: [''],
      buttonURL: [''],
      facebookURL: [''],
      instaURL: [''],
      twetterURL: [''],
      youtubeURL: [''],
      contactEmail: [''],
      contactNumber: [''],
    });

    this.addFooterLabelData = this.formBuilder.group({
      drawerHead: [''],
      drawerHead_Ar: [''],
      firstLable: [''],
      firstLable_Ar: [''],
      firstLable_URL: [''],
      secondLable: [''],
      secondLable_Ar: [''],
      secondLable_URL: [''],
      thirdLable: [''],
      thirdLable_Ar: [''],
      thirdLable_URL: [''],
      fourthLable: [''],
      fourthLable_Ar: [''],
      fourthLable_URL: [''],
      fifthLable: [''],
      fifthLable_Ar: [''],
      fifthLable_URL: [''],
    });

    this.fetchfooterData();
    this.fetchfooterContentData();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchfooterData(){
    let params = {
      url: "admin/getHomeFooterContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.addFooterCont = this.formBuilder.group({
          header: [resu.data.header,[]],
          header_ar: [resu.data.header_ar,[]],
          discription: [resu.data.discription,[]],
          discription_ar: [resu.data.discription_ar,[]],
          buttonName: [resu.data.buttonName,[]],
          buttonName_ar: [resu.data.buttonName_ar,[]],
          buttonURL: [resu.data.buttonURL,[]],
          facebookURL: [resu.data.facebookURL,[]],
          instaURL: [resu.data.instaURL,[]],
          twetterURL: [resu.data.twetterURL,[]],
          youtubeURL: [resu.data.youtubeURL,[]],
          contactEmail: [resu.data.contactEmail,[]],
          contactNumber: [resu.data.contactNumber,[]],
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }


  onSubmit(){

    const postData = this.addFooterCont.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/footerSaveorUpdate',
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


  fetchfooterContentData(){
    let params = {
      url: "admin/getFooterLableAndUrl",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
          this.footerLable = resu.data.content;
          // console.log("dd",this.footerLable)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onFooterContSubmit(){
    if(this.isEdit){
      this.footerLabelEditService(this.addFooterLabelData.value)
      return;
    }
  }

  viewFooterLabel(data,footerFields: any){
    this.modalService.open(footerFields, { centered: true,size: 'xl'  });

    this.isEdit = true;

    this.labelContId = data['_id']

    this.addFooterLabelData   = this.formBuilder.group({
      drawerHead: [data['drawerHead']],
      drawerHead_Ar: [data['drawerHead_Ar']],
      firstLable: [data['firstLable']],
      firstLable_Ar: [data['firstLable_Ar']],
      firstLable_URL: [data['firstLable_URL']],
      secondLable: [data['secondLable']],
      secondLable_Ar: [data['secondLable_Ar']],
      secondLable_URL: [data['secondLable_URL']],
      thirdLable: [data['thirdLable']],
      thirdLable_Ar: [data['thirdLable_Ar']],
      thirdLable_URL: [data['thirdLable_URL']],
      fourthLable: [data['fourthLable']],
      fourthLable_Ar: [data['fourthLable_Ar']],
      fourthLable_URL: [data['fourthLable_URL']],
      fifthLable: [data['fifthLable']],
      fifthLable_Ar: [data['fifthLable_Ar']],
      fifthLable_URL: [data['fifthLable_URL']],
    })
  }

  footerLabelEditService(data){
   
    data['contentId'] = this.labelContId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/editFooterLableAndUrl',
      data: data
    }
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

  onchangeDrawableStatus(values:any,val){
    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['contentId'] = val;
     object['_is_Visible_'] = visible;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/editStatusFooterLableAndUrl',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
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
}
