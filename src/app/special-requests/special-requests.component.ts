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
  showAccept = true;

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
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let specialRequestPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = specialRequestPermssion[6].write
      // console.log("prer", specialRequestPermssion[6])

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
        // console.log("ef",this.userName)

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
