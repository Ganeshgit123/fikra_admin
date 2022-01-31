import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-taking-off-projects',
  templateUrl: './taking-off-projects.component.html',
  styleUrls: ['./taking-off-projects.component.scss']
})
export class TakingOffProjectsComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  projectList: any=[];
  showAccept = true;
  launchDate:any;
  duraDate:any;
  finalDate:any = [];
  page = 1;
  total: any;
  searchTerm;

  constructor(
    private apiCall: ApiCallService
    ) {
   }
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Taking Off Project List', active: true }];
  
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
        url: "admin/getTakingOffProjectsForAdmin",
      }  
      this.apiCall.commonGetService(params).subscribe((result:any)=>{
        let resu = result.body;
        if(resu.error == false)
        {
           this.projectList = resu.data;
          this.total = this.projectList.length
          //  console.log("list",this.projectList)
          this.projectList.forEach(element => {
            var firstDate = element.basicInfoId.launchDate;
  
            this.duraDate =new Date(firstDate);
              var today = new Date();
             var Days = Math.abs(this.duraDate - today.getTime());
             var remainDate = element._is_succeed_ || (today >= element.basicInfoId.launchDate)? 0 : Math.ceil(Days / (1000 * 60 * 60 * 24)); 
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
