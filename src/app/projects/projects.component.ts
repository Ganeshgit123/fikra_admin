import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  launchDate:any;
  duraDate:any;
  finalDate:any = [];
  reportProjList: any = [];
  pledgePaymentList = [];
  showAccept:boolean;
  approveAccept:boolean;
  majorWrite:boolean;
  requestWrite:boolean;
  permName:any;
  isTimeBasedWirte:boolean;
  canWrite:boolean;

 constructor(
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private modalService: NgbModal,
  private route: ActivatedRoute,
    private router: Router,) {
 }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Projects List', active: true }];

    this.addComment = this.formBuilder.group({
      rejection_comment: [''],
    });

    this._fetchData();
    this.callRolePermission();
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
    data['createdBy'] = this.updatedby;
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
    data['createdBy'] = this.updatedby;
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

  onChangeProjRequestWithStatus(id,status,centerDataModal:any){
    this.projectId = id;

      var valFrom = ''
      var valTo = status;

    const object = {}

    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;
   object['tabName'] = "Projects";
   object['feildName'] = "Admin Approval";
   object['valueFrom'] = valFrom;
   object['valueTo'] = valTo;
   object['APIURL'] = "https://fikra.app/api/admin/adminProjectApproval";
   object['paramsForAPI'] = {
    ['projectId'] : this.projectId,
    ['aproval_Status'] : status,
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

  onReqBannerStatus(values:any,id){
    if(values.currentTarget.checked === true){
      var valFrom = false
      var valTo = true
      const object = {}

      object['createdBy'] = this.updatedby;
     object['userType'] = "admin";
     object['role'] = this.role;
     object['tabName'] = "Projects";
     object['feildName'] = "Home Page Banner";
     object['valueFrom'] = valFrom;
     object['valueTo'] = valTo;
     object['APIURL'] = "https://fikra.app/api/admin/updateProjectToSlide ";
     object['paramsForAPI'] = {
      ['projectId'] : id,
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
     } else {
      var valFrom = true
      var valTo = false
      const object = {}

      object['createdBy'] = this.updatedby;
     object['userType'] = "admin";
     object['role'] = this.role;
     object['tabName'] = "Projects";
     object['feildName'] = "Home Page Banner";
     object['valueFrom'] = valFrom;
     object['valueTo'] = valTo;
     object['APIURL'] = "https://fikra.app/api/admin/removeProjectToSlide ";
     object['paramsForAPI'] = {
      ['projectId'] : id,
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
  }

  deleteReqProject(id){
   
    const object = {}
    object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;
    object['tabName'] = "Projects";
    object['feildName'] = "Delete Action";
    object['valueFrom'] = '';
    object['valueTo'] = "Delete";
    object['APIURL'] = "https://fikra.app/api/admin/removeProjectToSlide ";
    object['paramsForAPI'] = {
     ['projectId'] : id,
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
}

