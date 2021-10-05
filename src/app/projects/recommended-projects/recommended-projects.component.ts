import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recommended-projects',
  templateUrl: './recommended-projects.component.html',
  styleUrls: ['./recommended-projects.component.scss']
})
export class RecommendedProjectsComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  projectList: any=[];
  showAccept = true;
  launchDate:any;
  duraDate:any;
  finalDate:any = [];

   constructor(
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private modalService: NgbModal) {
 }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Recommended List', active: true }];

    this.fetchProjectData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let projectPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = projectPermssion[0].write
      // console.log("prer", this.showAccept)

    }
  }
  
  fetchProjectData(){
    let params = {
      url: "admin/getRecommenedProjectsAdmin",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
         this.projectList = resu.data;
        //  console.log("list",this.projectList)
        this.projectList.forEach(element => {
          var firstDate = element.basicInfoId.launchDate;
          var endDate = element.basicInfoId.campaignDuation;

          this.duraDate =new Date(endDate);
            var today = new Date();
           var Days = Math.abs(this.duraDate - today.getTime());
           var remainDate = Math.ceil(Days / (1000 * 60 * 60 * 24)); 

        element.finalDate = remainDate

      })

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

}
