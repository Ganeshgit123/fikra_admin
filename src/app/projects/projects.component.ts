import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  projectList: any=[];
  searchTerm;
  addComment:FormGroup;
  
 constructor(
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,) {
 }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Projects List', active: true }];

    this.addComment = this.formBuilder.group({
      rejection_comment: [''],
    });

    this._fetchData();
  }

  _fetchData() {

    let params = {
      url: "admin/listProject",
    }  
    this.apiCall.smallGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
                this.projectList = resu.data;
  console.log("llll",this.projectList)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  
  
   }

   onChangeProjStatus(id,status){

   }

   rejectReason(){
     
   }

}
