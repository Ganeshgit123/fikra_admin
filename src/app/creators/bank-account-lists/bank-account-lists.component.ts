import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-bank-account-lists',
  templateUrl: './bank-account-lists.component.html',
  styleUrls: ['./bank-account-lists.component.scss']
})
export class BankAccountListsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  searchTerm;
  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  getRequestList =[];
  permName:any;
  isTimeBasedWirte:boolean;
  canWrite:boolean;
  showAccept:boolean;
  approveAccept:boolean;
  majorWrite:boolean;
  requestWrite:boolean;
  page = 1;
  getReqTotal: any;
  getVerifyBankList = [];
  verifyBankTotal: any;
  searchTerm1;
  userId: any;
  getBankDetails:any = [];
  constructor(
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private modalService: NgbModal,
  private route: ActivatedRoute,
  ) {
 }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Requests List', active: true }];
    this.route.params.subscribe(params => this.userId = params.id);
    this._fetchData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') == 's_a_r'){
      this.majorWrite = true;
    }
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let creatorPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = creatorPermssion[2].write
      this.approveAccept = creatorPermssion[2]._with_Approval_
      this.permName = creatorPermssion[2].permissionName
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

  _fetchData() {

    let params = {
      url: "admin/getBankDetailsById",
      userId: this.userId,
    };
    this.apiCall.userGetService(params).subscribe(
      (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          this.getBankDetails = resu.data;
          this.getReqTotal = this.getBankDetails.length
          // console.log("ff",this.getBankDetails)
        } else {
          this.apiCall.showToast(resu.message, "Error", "errorToastr");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  
   }

   onBankVerficationStatus(values:any,userid,bankid){

    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['userId'] = userid;
     object['bankId'] = bankid;
     object['approved'] = visible;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/approveBankById',
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

  onBankVerifyRequestStatus(val,userid,bankid){
    if(val.currentTarget.checked === true){
      var visible = true 
      var valFrom = false
      var valTo = true
     } else {
       var visible = false
       var valFrom = true
       var valTo = false
     }

    const object = {}

    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;
   object['tabName'] = "Creators -> Bank A/c Requests";
   object['feildName'] = "Status";
   object['valueFrom'] = valFrom;
   object['valueTo'] = valTo;
   object['APIURL'] = "https://fikra.app/api/admin/approveBankById";
   object['paramsForAPI'] = {
     ['userId'] : userid,
     ['approved'] : visible,
     ['bankId'] : bankid,
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

  deleteBankReq(userid,bankid) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#ff3d60",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        const data = {};
        data["userId"] = userid;
        data["bankId"] = bankid;
        data["createdBy"] = this.updatedby;
        data["userType"] = "admin";
        data["role"] = this.role;
  
        var params = {
          url: "admin/deleteBankById",
          data: data,
        };
        // console.log("fef",params)
        this.apiCall.commonPostService(params).subscribe(
          (response: any) => {
            if (response.body.error == false) {
              // Success
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              // this.apiCall.showToast('Status Updated Successfully', 'Success', 'successToastr')
              this.ngOnInit();
            } else {
              // Query Error
              this.apiCall.showToast(
                response.body.message,
                "Error",
                "errorToastr"
              );
            }
          },
          (error) => {
            this.apiCall.showToast("Server Error !!", "Oops", "errorToastr");
            console.log("Error", error);
          }
        );
      }
    });
  }

  verifiedList(creatorCorner: any){
    this.modalService.open(creatorCorner, { centered: true,size:'xl' });
    this.verfiedGetApiList();
  }
  verfiedGetApiList(){
    let params = {
      url: "admin/getVerifiedBankDetails",
    }  
    this.apiCall.userGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.getVerifyBankList = resu.data;
        this.verifyBankTotal = this.getRequestList.length
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }
}
