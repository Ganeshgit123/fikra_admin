import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $:any;

@Component({
  selector: 'app-newsletter-content',
  templateUrl: './newsletter-content.component.html',
  styleUrls: ['./newsletter-content.component.scss']
})
export class NewsletterContentComponent implements OnInit {
  addNewsLetter: FormGroup;
  updatedby:any;
  role:any;
  showAccept = true;

  
  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addNewsLetter = this.formBuilder.group({
      subcribeHead: [''],
      subcribeHead_ar: [''],
      subcribeBody: [''],
      subcribeBody_ar: [''],
    });

    this.fetchnewsletterData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchnewsletterData(){
    let params = {
      url: "admin/getHomeNewsletterContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.addNewsLetter = this.formBuilder.group({
          subcribeHead: [resu.data.subcribeHead,[]],
          subcribeHead_ar: [resu.data.subcribeHead_ar,[]],
          subcribeBody: [resu.data.subcribeBody,[]],
          subcribeBody_ar: [resu.data.subcribeBody_ar,[]],
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  contentUpdate(){

    const postData = this.addNewsLetter.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;
    postData['_isNewsSubscriptionOn_'] = true

    var params = {
      url: 'admin/postSubscriptionContentandUpdate',
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
