import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'

@Component({
  selector: 'app-creators',
  templateUrl: './creators.component.html',
  styleUrls: ['./creators.component.scss']
})
export class CreatorsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  searchTerm;
  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');
  getCreateList =[];
  tempWrite = false;
  changeDesc:FormGroup;
  respnseData = [];
  adminApprovStat:any;
  adminrejecStat:any;
  usedPerms:any;
  permName:any;
  isTimeBasedWirte:boolean;
  canWrite:boolean;
  showAccept:boolean;
  approveAccept:boolean;
  majorWrite:boolean;
  requestWrite:boolean;
  page = 1;
  total: any;
  creatorcsvOptions: any;

  constructor(
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private modalService: NgbModal) {

 }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Creators List', active: true }];

    this._fetchData();
    this.callRolePermission();

    this.changeDesc = this.formBuilder.group({
      changesDescription: [''],
    });

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

    // if(this.approveAccept == true){
    //   this.getAdminApproved();
    // }
    }
  }

  _fetchData() {

    let params = {
      url: "admin/getCreatorList",
    }  
    this.apiCall.userGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.getCreateList = resu.data.reverse();
        this.total = this.getCreateList.length
      // console.log("fetch",this.getCreateList)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  
   }

   onCretiveIndependentStatus(values:any,val){
    //  console.log("ganesh")
    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['creatorId'] = val;
     object['_is_On_Creative_In_'] = visible;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/setUserToIndepententSection',
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

  reqAdmin(adminReqModel:any){
    this.changeDesc.reset();
    this.modalService.open(adminReqModel, { centered: true });
  }

  onReqSubmit(){
    const postData = this.changeDesc.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;
    postData['writePermissionName'] = this.permName;

    var params = {
      url: 'admin/postAdminUserRequest',
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

  showAdminResponse(responModel:any){
    this.modalService.open(responModel, { centered: true });

    let params = {
      url: "admin/getAllAdminAprovedTokens",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.respnseData = resu.data;
        
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    }); 
  }

  getAdminApproved(){
    let params = {
      url: "admin/getAllAdminAprovedTokens",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.respnseData = resu.data;

        this.respnseData.forEach(element => {
            this.adminApprovStat = element._admin_Responce_Status;
            this.adminrejecStat = element._is_Rejected_;
            this.usedPerms = element._is_Used_;
            // console.log("da",this.adminApprovStat)
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    }); 
  }

  proceedSubmit(id){
    const object = {}

    object['requestId'] = id;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/verifyToken',
     data: object
   }
   this.apiCall.commonPostService(params).subscribe(
     (response: any) => {
       if (response.body.error == false) {
         // Success
         this.apiCall.showToast("Changed Successfully", 'Success', 'successToastr')
         this.modalService.dismissAll();
         this.tempWrite  = true;
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

  onApproveIndependentStatus(val,id){

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
   object['tabName'] = "Creators";
   object['feildName'] = "Creative Independent Status";
   object['valueFrom'] = valFrom;
   object['valueTo'] = valTo;
   object['APIURL'] = "https://fikra.app/api/admin/setUserToIndepententSection";
   object['paramsForAPI'] = {
     ['creatorId'] : id,
     ['_is_On_Creative_In_'] : visible,
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

  exportList(){
    let params = {
      url: "admin/getCreatorList",
    }  
    this.apiCall.userGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.getCreateList = resu.data;
        if(resu.data.length > 0){
          this.exportCreatorMailData(resu.data)
        }
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
   }
  
   exportCreatorMailData(data){
    if(data.length > 0){
      var bulkArray = []
      data.forEach(element => {
        var obj = {}
        obj['Email Id'] = element.email
  
        bulkArray.push(obj)
      })
  
      this.creatorcsvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Backers Email Id',
        useBom: true,
        noDownload: false,
        headers: ["Email Id"]
      };
      new  AngularCsv(bulkArray, "Backers Email Id", this.creatorcsvOptions);
  
    }
  }

}
