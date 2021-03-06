import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  updatedby:any;
  role:any;
  addJobData : FormGroup;
  jobData = [];
  isEdit = false;
  jobId:any;
  branchList = [];
  showAccept = true;
  searchTerm;
  page = 1;
  total: any;

  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
 }

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addJobData = this.formBuilder.group({
      jobTitle: [''],
      jobTitleAr: [''],
      jobDescription: [''],
      jobDescriptionAr: [''],
      criteria: [''],
      criteriaAr: [''],
      jobRole: [''],
      jobRoleAr: [''],
      jobVacancies: [''],
      // location: [''],
    });
    this.fetchbranchData();
    this.fetchJobData();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchbranchData(){
    let params = {
      url: "admin/getBranchDetails",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.branchList = resu.data;
        // console.log("ef",this.branchList)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  fetchJobData(){
    let params = {
      url: "admin/getAllJobsList",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.jobData = resu.data;
        this.total = this.jobData.length
        console.log("ef",this.jobData)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  addJobs(creatorCorner: any){
    this.addJobData.reset();
    this.modalService.open(creatorCorner, { centered: true,size:'lg' });

  }

  viewJobs(data,creatorCorner: any){
    this.modalService.open(creatorCorner, { centered: true,size:'lg' });

    this.isEdit = true;

    this.jobId = data['_id']
  
    this.addJobData   = this.formBuilder.group({
      jobTitle: [data['jobTitle']],
      jobTitleAr: [data['jobTitleAr']],
      jobDescription: [data['jobDescription']],
      jobDescriptionAr: [data['jobDescriptionAr']],
      criteria: [data['criteria']],
      criteriaAr: [data['criteriaAr']],
      jobRole: [data['jobRole']],
      jobRoleAr: [data['jobRoleAr']],
      jobVacancies: [data['jobVacancies']],
      // location: [data['location']._id],
    })
  }

  onSubmit(){

    if(this.isEdit){
      this.jobEditService(this.addJobData.value)
      return;
    }

    const postData = this.addJobData.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postANewJob',
      data: postData
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.modalService.dismissAll();
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

  jobEditService(data){
    data['jobsId'] = this.jobId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    var params = {
      url: 'admin/updateJobsContent',
      data: data
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.isEdit = false;
          this.modalService.dismissAll();
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

  onchangeJobStatus(values:any,val){

    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['jobsId'] = val;
     object['_is_On_'] = visible;
     object['_is_Deleted_'] = false;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/updateJobsStatus',
      data: object
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast("Changed Successfully", 'Success', 'successToastr')
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

  onDeleteJobStatus(val,id){
    const object = {}

    object['jobsId'] = id;
    object['_is_On_'] = false;
    object['_is_Deleted_'] = val;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/updateJobsStatus',
     data: object
   }
  //  console.log("da",params)
   this.apiCall.commonPostService(params).subscribe(
     (response: any) => {
       if (response.body.error == false) {
         // Success
         this.apiCall.showToast("Deleted Successfully", 'Success', 'successToastr')
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
