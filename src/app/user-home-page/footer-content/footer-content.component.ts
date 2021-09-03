import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
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

    this.fetchfooterData();
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

}
