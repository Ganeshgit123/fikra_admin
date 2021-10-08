import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-back-project',
  templateUrl: './request-back-project.component.html',
  styleUrls: ['./request-back-project.component.scss']
})
export class RequestBackProjectComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  projectList: any=[];
  searchTerm;
  addComment:FormGroup;
  projectId: any;
  projectStatus:any;
  showAccept = true;
  launchDate:any;
  duraDate:any;
  finalDate:any = [];
  page = 1;
  total: any;

   constructor(
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private modalService: NgbModal) {
 }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Projects List', active: true }];

    this._fetchData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let projectPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = projectPermssion[0].write
      // console.log("prer", this.showAccept)

    }
  }

  _fetchData() {

    let params = {
      url: "admin/getRequestBackendProjectList",
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

   deleteProject(id){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#ff3d60',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
    console.log("id",id)
   const data = {}
  data['projectId'] = id
  data['createdBy'] = this.updatedby;
  data['userType'] = "admin";
  data['role'] = this.role;

  var params = {
    url: 'admin/adminProjectDelete',
    data: data
  }
  console.log("fef",params)
  this.apiCall.commonPutService(params).subscribe(
    (response: any) => {
      if (response.body.error == false) {
        // Success
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        // this.apiCall.showToast('Status Updated Successfully', 'Success', 'successToastr')
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
    });

  }


}
