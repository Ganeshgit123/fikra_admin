import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-special-services',
  templateUrl: './special-services.component.html',
  styleUrls: ['./special-services.component.scss']
})
export class SpecialServicesComponent implements OnInit {
  addNewService:FormGroup;
  updatedby:any;
  role:any;
  serviceList =[];
  isEdit = false;
  serviceId:any;
  showAccept = true;
  searchTerm;
  page = 1;
  total: any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addNewService = this.formBuilder.group({
      specialReqestName: [''],
      specialReqestNameAr: [''],
      requestDescription: [''],
      requestDescriptionAr: [''],
    });

    this.fetchSeriveList();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = settingPermssion[4].write
      // console.log("prer", settingPermssion[4])
    }
  }

  fetchSeriveList(){
    let params = {
      url: "admin/getAllServices",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.serviceList = resu.data;
        this.total = this.serviceList.length
        // console.log("ef",this.categList)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  addService(centerDataModal: any){
    this.modalService.open(centerDataModal, { centered: true });
  }

  addServiceSubmit(){

    if(this.isEdit){
      this.serviceEditService(this.addNewService.value)
      return;
    }

    const postData = this.addNewService.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/addServiceForSpecialRequest',
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

  viewService(data,centerDataModal: any){
    this.modalService.open(centerDataModal, { centered: true });
    this.isEdit = true;
    this.serviceId = data['_id'];
    this.addNewService   = this.formBuilder.group({
      specialReqestName: [data['specialReqestName']],
      specialReqestNameAr: [data['specialReqestNameAr']],
      requestDescription: [data['requestDescription']],
      requestDescriptionAr: [data['requestDescriptionAr']],
    })
  }

  serviceEditService(data){
    
    data['serviceId'] = this.serviceId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/updateServiceForSpecialRequest',
      data: data
    }

    // console.log("par",params)
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

  onchangeServiceStatus(values:any,id){

    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }

    //  console.log("boole",visible)
     const object = {}

     object['serviceId'] = id;
     object['_is_On_'] = visible;
     object['_is_Deleted_'] = false;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/statusServiceForSpecialRequest',
      data: object
    }
    // console.log("fef",params)
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

  deleteService(id,val){
    
    const data = {}
  
    data['serviceId'] = id
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['_is_On_'] = val;
    data['_is_Deleted_'] = true;

    var params = {
      url: 'admin/statusServiceForSpecialRequest',
      data: data
    }

    // console.log("par",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast('Deleted Successfully', 'Success', 'successToastr')
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
