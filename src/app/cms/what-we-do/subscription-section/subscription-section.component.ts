import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';

@Component({
  selector: 'app-subscription-section',
  templateUrl: './subscription-section.component.html',
  styleUrls: ['./subscription-section.component.scss']
})
export class SubscriptionSectionComponent implements OnInit {
  updatedby:any;
  role:any;
  subscribeContent:FormGroup;
  showAccept = true;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    
    this.subscribeContent = this.formBuilder.group({
      header: [''],
      header_Ar: [''],
      description: [''],
      description_Ar: [''],
    });

    this.fetchSuscribeData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchSuscribeData(){
    let params = {
      url: "admin/getWhatWeDoContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.subscribeContent = this.formBuilder.group({
          header: [resu.data.subscriptionSection[0].header,[]],
          header_Ar: [resu.data.subscriptionSection[0].header_Ar,[]],
          description: [resu.data.subscriptionSection[0].description,[]],
          description_Ar: [resu.data.subscriptionSection[0].description_Ar,[]],
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onSubmit(){
    const postData = this.subscribeContent.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postsubscriptionSection_WWD',
      data: postData
    }
    // console.log("data",params)
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
