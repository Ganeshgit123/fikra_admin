import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { element } from 'protractor';

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
  projectId: any;
  projectStatus:any;
  showAccept = true;
  launchDate:any;
  duraDate:any;
  finalDate:any = [];
  transHistory = [];
  payableAmount:any;
  modelName:any;
  isCollapsed = true;
  addTransData:FormGroup;
  projId:any;
  isEditTrans:any;
  transId:any;

 constructor(
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private modalService: NgbModal) {
 }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Projects List', active: true }];

    this.addComment = this.formBuilder.group({
      rejection_comment: [''],
    });

    this.addTransData = this.formBuilder.group({
      description: [''],
      payedAmount: [''],
      balancePayable: [''],
    });

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
      url: "admin/listProject",
    }  
    this.apiCall.smallGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
         this.projectList = resu.data;
        
          this.projectList.forEach(element => {
            var firstDate = element.basicInfoId.launchDate;
            var endDate = element.basicInfoId.campaignDuation;

            this.launchDate =new Date(firstDate);
            this.duraDate =new Date(endDate);
           var Days = Math.abs(this.duraDate - this.launchDate);
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

   onChangeProjStatus(id,status,centerDataModal:any){
    
    this.projectId = id;

    this.projectStatus = status;
    
    if(this.projectStatus === 'rejected'){
      this.modalService.open(centerDataModal, { centered: true });
    }

   

    const data = {}
    data['projectId'] = this.projectId
    data['createdby'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['aproval_Status'] = this.projectStatus;
  
    var params = {
      url: 'admin/adminProjectApproval',
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

   rejectReason(){

    const data = {}
    data['projectId'] = this.projectId
    data['createdby'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['rejection_comment'] = this.addComment.get('rejection_comment').value;
    data['aproval_Status'] = this.projectStatus;

    var params = {
      url: 'admin/adminProjectApproval',
      data: data
    }
    // console.log("Reject",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast('Reason updated Successfully', 'Success', 'successToastr')
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
  data['updatedby'] = this.updatedby;
  data['userType'] = "admin";
  data['role'] = this.role;

  var params = {
    url: 'admin/adminProjectDelete',
    data: data
  }
  // console.log("fef",params)
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

  onHomeBannerStatus(values:any,val){
    if(values.currentTarget.checked === true){
      this.addHomeBannList(val);
     } else {
      this.removeHomeBannList(val);
     }

  }

  addHomeBannList(id){
    const object = {};
    object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;
    object['projectId'] = id

    var params = {
      url: 'admin/updateProjectToSlide',
      data: object
    }
// console.log("ddd",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {

          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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

  removeHomeBannList(id){
    const object = {};
    object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;
    object['projectId'] = id

    var params = {
      url: 'admin/removeProjectToSlide',
      data: object
    }
// console.log("ddd",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {

          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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



  viewTrans(trans: any,id){
    this.modalService.open(trans, { centered: true,size: 'xl' });
    this.projId = id;
    this.fetchTransaction(this.projId);
  }

  fetchTransaction(id){
    let params = {
      url: "admin/getTransactionAdmin",
      projectId : id
    }  
    this.apiCall.projectLikedGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
       this.payableAmount = resu.data.payableAmount;
       this.modelName = resu.data.modelName;
        this.transHistory = resu.data.transactionHistory;

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    }); 
  }

  onTransSubmit(){

    if(this.isEditTrans){
      this.transEditService(this.addTransData.value)
      return;
    }

    const postData = this.addTransData.value;
    postData['projectId'] = this.projId;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/addTransactionAdmin',
      data: postData
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.modalService.dismissAll();
          this.isCollapsed = true;
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

  editTrans(data){

    this.isCollapsed = false;
    this.isEditTrans = true;

    this.transId = data['_id']
    this.addTransData   = this.formBuilder.group({
      payedAmount: [data['payedAmount']],
      balancePayable: [data['balancePayable']],
      description: [data['description']],
    })
  }

  transEditService(data){
    data['projectId'] = this.projId
    data['transactionId'] = this.transId;
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/editTransactionAdmin',
      data: data
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.isEditTrans = false;
          this.modalService.dismissAll();
          this.isCollapsed = true;
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

  onDeleteTrans(id){
    const object = {}

    object['transactionId'] = id;
    object['projectId'] = this.projId;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/deleteTransactionAdmin',
     data: object
   }
  //  console.log("da",params)
   this.apiCall.commonPostService(params).subscribe(
     (response: any) => {
       if (response.body.error == false) {
         // Success
         this.apiCall.showToast("Deleted Successfully", 'Success', 'successToastr')
         this.ngOnInit();
         this.modalService.dismissAll();
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

