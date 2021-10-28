import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Form} from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  addNewRole:FormGroup;
  roleData:any;
  isEdit = false;
  roleId:any;
  searchTerm;
  page = 1;
  total: any;

   constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Roles' },{ label: 'Roles List', active: true }];
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addNewRole = this.formBuilder.group({
      roleName: [''],
    });

    this.fetchRoleData();
  }

  fetchRoleData(){
    let params = {
      url: "admin/getAllRoles",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.roleData = resu.data;
        this.total = this.roleData.length
        // console.log("data",this.roleData)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  addRole(roleCorner: any){
    this.addNewRole.reset();
    this.modalService.open(roleCorner, { centered: true });
  }

  onSubmit(){

    if(this.isEdit){
      this.roleEditService(this.addNewRole.value)
      return;
    }


    const postData = this.addNewRole.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/addRoleWithName',
      data: postData
    }
    // console.log("fefe",params)
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

  viewRole(data,roleCorner: any){
    this.modalService.open(roleCorner, { centered: true });

    this.isEdit = true;

    this.roleId = data['_id']
    this.addNewRole   = this.formBuilder.group({
      roleName: [data['roleName']],
    })

  }

  roleEditService(data){
    data['_id'] = this.roleId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/updateRoleDetails',
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



  onDeleteRole(id){
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
   const data = {}
  data['roleId'] = id
  data['createdBy'] = this.updatedby;
  data['userType'] = "admin";
  data['role'] = this.role;

  var params = {
    url: 'admin/removeRolesById',
    data: data
  }
  // console.log("fef",params)
  this.apiCall.commonPostService(params).subscribe(
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
