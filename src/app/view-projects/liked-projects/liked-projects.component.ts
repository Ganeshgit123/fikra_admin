import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-liked-projects',
  templateUrl: './liked-projects.component.html',
  styleUrls: ['./liked-projects.component.scss']
})
export class LikedProjectsComponent implements OnInit {
  projectId:any;
  updatedby:any;
  role:any;
  projectList=[];
  investorName:any;
  investorFullName:any;
  investorMobile:any;
  investorDob:any;
  investorId:any;
  investorEmail:any;

  constructor(private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.route.params.subscribe(params => this.projectId = params.id);

    this.fetchLikedUser();
  }
  
  fetchLikedUser(){
    let params = {
      url: "admin/getLinkeduserByProjectId",
      projectId : this.projectId
    }  
    this.apiCall.projectLikedGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
         this.projectList = resu.data;
         this.projectList.forEach(element => {
           this.investorName = element.userId.userName
           this.investorFullName = element.userId.fullName
           this.investorEmail = element.userId.email
           this.investorMobile = element.userId.mobileNumber
           this.investorDob = element.userId.dob
           this.investorId = element.userId._id
         });
        //  console.log("name",this.investorName)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

}
