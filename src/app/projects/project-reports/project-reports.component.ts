import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormGroup, FormBuilder,FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-project-reports',
  templateUrl: './project-reports.component.html',
  styleUrls: ['./project-reports.component.scss']
})
export class ProjectReportsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  searchTerm;
  reportedList = [];
  adminStatus:any;
  showAccept:boolean;
  approveAccept:boolean;
  majorWrite:boolean;
  requestWrite:boolean;
  permName:any;
  isTimeBasedWirte:boolean;
  canWrite:boolean;
  page = 1;
  total: any;
  commentForm:FormGroup;
  reportId:any;

   constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Reported-Project List', active: true }];

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.fetchReportedList();
    this.callRolePermission();

    this.commentForm = this.formBuilder.group({
      reportComment: [''],
    });
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') == 's_a_r'){
      this.majorWrite = true;
    }
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let creatorPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = creatorPermssion[0].write
      this.approveAccept = creatorPermssion[0]._with_Approval_
      this.permName = creatorPermssion[0].permissionName
      this.isTimeBasedWirte = JSON.parse(sessionStorage.getItem('isTimeBasedWirte'));
      this.canWrite =JSON.parse(sessionStorage.getItem('canWrite'));

     if(this.showAccept == true){
      if(this.approveAccept == false && this.isTimeBasedWirte == false){
            this.majorWrite = true;
            console.log("first_condition")
      }else if(this.isTimeBasedWirte === true && this.canWrite === true){
        this.majorWrite = true;
        console.log("second_condition")
      }else if(this.approveAccept == true){
        this.requestWrite = true;
        console.log("request_condition")
      }else{
        this.majorWrite = false;
      console.log("1st_else_condition")
      }
    }else{
      this.majorWrite = false;
      console.log("2nd_else_condition")
    }

    }
  }

  fetchReportedList(){
    let params = {
      url: "admin/getReportAboutProjectAdmin",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.reportedList = resu.data;
        this.total = this.reportedList.length

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onChangeReportStatus(id,status){
    const data = {}
    data['reportId'] = id
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['status'] = status;
  
    var params = {
      url: 'admin/updateReportStatus',
      data: data
    }
    // console.log("fef",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast('Status Updated Successfully', 'Success', 'successToastr')
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

  onChangeReportRequestStatus(id,val){
    
    var valFrom = ''
    var valTo = val;

  const object = {}

  object['createdBy'] = this.updatedby;
 object['userType'] = "admin";
 object['role'] = this.role;
 object['tabName'] = "Projects -> Reported Projecrs";
 object['feildName'] = "Admin Status Change";
 object['valueFrom'] = valFrom;
 object['valueTo'] = valTo;
 object['APIURL'] = "https://fikra.app/api/admin/updateReportStatus";
 object['paramsForAPI'] = {
  ['reportId'] : id,
  ['status'] : val,
 };

  var params = {
   url: 'admin/requsetToSuperAdminForChange',
   data: object
 }
//  console.log("pa",params)
 this.apiCall.commonPostService(params).subscribe(
   (response: any) => {
     if (response.body.error == false) {
       // Success
       this.apiCall.showToast("Request Sent Successfully", 'Success', 'successToastr')
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

  addComment(commentSection: any,id){
    this.modalService.open(commentSection, { centered: true});
    this.reportId = id;
  }

  onCommentSubmit(){
    const postData = this.commentForm.value;
    postData['reportId'] = this.reportId;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params1 = {
      url: 'admin/updateReportComment',
      data: postData
    }
  this.apiCall.commonPostService(params1).subscribe(
    (response: any) => {
    if (response.body.error == false) {
    
    this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
    this.modalService.dismissAll();
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
