import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';

@Component({
  selector: 'app-reward-content',
  templateUrl: './reward-content.component.html',
  styleUrls: ['./reward-content.component.scss']
})
export class RewardContentComponent implements OnInit {
  updatedby:any;
  role:any;
  addRewardContent: FormGroup;
  showAccept = true;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addRewardContent = this.formBuilder.group({
      tabName: [''],
      tabName_Ar: [''],
      tabHead: [''],
      tabHead_Ar: [''],
      description: [''],
      description_Ar: [''],
      rewardHead: [''],
      rewardHead_Ar: [''],
      rewardDescription: [''],
      rewardDescription_Ar: [''],
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
      url: "admin/getProjectRewardContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.addRewardContent = this.formBuilder.group({
          tabName: [resu.data.tabName,[]],
          tabName_Ar: [resu.data.tabName_Ar,[]],
          tabHead: [resu.data.tabHead,[]],
          tabHead_Ar: [resu.data.tabHead_Ar,[]],
          description: [resu.data.description,[]],
          description_Ar: [resu.data.description_Ar,[]],
          rewardHead: [resu.data.rewardHead,[]],
          rewardHead_Ar: [resu.data.rewardHead_Ar,[]],
          rewardDescription: [resu.data.rewardDescription,[]],
          rewardDescription_Ar: [resu.data.description_Ar,[]],
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onSubmit(){
    const postData = this.addRewardContent.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postProjectRewardPage_CMS',
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
