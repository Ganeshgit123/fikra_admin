import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit {
  projectId:any;
  projectList: any=[];
  rewardArray =[];

  constructor(private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
      this.route.params.subscribe(params => this.projectId = params.id);
  
      this._fetchRewardInfo();
    }

    _fetchRewardInfo(){
      let params = {
        url: "admin/getProjectListById",
        projectId : this.projectId
      }  
      this.apiCall.projectGetService(params).subscribe((result:any)=>{
        let resu = result.body;
        if(resu.error == false)
        {
           this.projectList = resu.data.rewardTableId;

            console.log("rew",this.projectList)

        }else{
          this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
        }
      },(error)=>{
         console.error(error);
         
      });
    }

}
