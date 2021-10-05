import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sms-campaign',
  templateUrl: './sms-campaign.component.html',
  styleUrls: ['./sms-campaign.component.scss']
})
export class SmsCampaignComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  addUsers:FormGroup;
  getuserList = [];
  showAccept = true;

  constructor(private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
        ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');
    
    this.addUsers = this.formBuilder.group({
      mobileNumbers: [''],
      message: [''],
    });
    this._fetchData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[11].write
      // console.log("prer", contentPermssion[11])
    }
  }

  _fetchData() {

    let params = {
      url: "admin/getInvestorList",
    }  
    this.apiCall.userGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.getuserList = resu.data;
     console.log("lpl",this.getuserList)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  
  
   }

  addUsersSubmit(){
    const tagValue = this.addUsers.value.mobileNumbers

    const postData = {mobileNumbers:[]};
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;
    postData['message'] = this.addUsers.value.message;
    postData['mobileNumbers'] = tagValue.join('|')
    
    
    var params = {
      url: 'admin/sendSMSToMultipleUser',
      data: postData
    }
    // console.log("ppa",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log("res",response)
        if (response.body.error == false) {

          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.ngOnInit();
        } else {
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
