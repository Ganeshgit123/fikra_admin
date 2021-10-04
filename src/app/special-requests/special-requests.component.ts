import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder,FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-special-requests',
  templateUrl: './special-requests.component.html',
  styleUrls: ['./special-requests.component.scss']
})
export class SpecialRequestsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  searchTerm;
  requestsList = [];
  addNewComment:FormGroup;
  permName:any;
  isTimeBasedWirte:boolean;
  canWrite:boolean;
  showAccept:boolean;
  approveAccept:boolean;
  majorWrite:boolean;
  requestWrite:boolean;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Special-Request List', active: true }];

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addNewComment = this.formBuilder.group({
      adminComment: [''],
    });

    this.fetchRequestList();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') == 's_a_r'){
      this.majorWrite = true;
    }
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let creatorPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = creatorPermssion[6].write
      this.approveAccept = creatorPermssion[6]._with_Approval_
      this.permName = creatorPermssion[6].permissionName
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

  fetchRequestList(){
    let params = {
      url: "admin/getCreatorSpecialRequest",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.requestsList = resu.data;
        // console.log("ef",this.requestsList)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  adminComment(centerDataModal: any){
    this.modalService.open(centerDataModal, { centered: true });
  }

  addCommentSubmit(id){
    const postData = this.addNewComment.value;
    postData['createdBy'] = this.updatedby;
    postData['requestId'] = id;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/sendCommentForSpecialRequest',
      data: postData
    }
    this.apiCall.commonPostService(params).subscribe(
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
