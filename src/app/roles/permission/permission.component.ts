import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Form} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  roleData:any;
  userList = [];
  permissionData = [];
  roleIdByclick:any;
  isRoleClick = false;
  isEdit = false;
  adminUserId:any;
  changeTime:FormGroup;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Roles' },{ label: 'Permissions', active: true }];
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.fetchRoleData();

    
    this.changeTime = this.formBuilder.group({
      timeFrom: [''],
      timeTo: [''],
    });
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
        // console.log("data",this.roleData)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  roleClick(id){
    this.isRoleClick = true;
    this.roleIdByclick = id
    let params = {
      url: "admin/getAdminUserByRoleId",
      roleId : this.roleIdByclick
    }  

    this.apiCall.roleGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.userList = resu.data;
        // console.log("permis",this.permissionData)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }


  viewPermission(permissionModel: any){
    this.modalService.open(permissionModel, { centered: true,size:'xl' });
    this.permissionClick(this.roleIdByclick);
  }

  permissionClick(id){
    this.roleIdByclick = id
    let params = {
      url: "admin/getRolesById",
      roleId : this.roleIdByclick
    }  

    this.apiCall.roleGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.permissionData = resu.data.permission;
        // console.log("permis",this.permissionData)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }


  permission_update_change(event, permissions,val){

    var change = event.currentTarget.checked

    var data= {}

     if(val == 'read'){
      data['read'] = change
     } else if (val == 'write'){
      data['write'] = change
     } else if(val == 'with_approve'){
      data['_with_Approval_'] = change
     }
     
    data['roleId']=this.roleIdByclick
    data['permissionId']=permissions.permissionId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = 
    {
      url: 'admin/updateRolePermissions',
      data: data,  
    }
//  console.log("data",params)
    this.apiCall.commonPostService(params).subscribe((response:any)=>{
      if(response.body.error == false)
      {
        this.apiCall.showToast('Changed Successfully', 'Success', 'successToastr')
       }
       else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
       }
   });
  }

  viewTime(data,timeChangeModel: any){

    this.modalService.open(timeChangeModel, { centered: true });

    this.isEdit = true;

    this.adminUserId = data['_id']
    this.changeTime   = this.formBuilder.group({
      timeFrom: [data['timeFrom']],
      timeTo: [data['timeTo']],
    })
  }

  onTimeSubmit(){
    if(this.isEdit){
      this.timeEditService(this.changeTime.value)
      return;
    }
  }

  timeEditService(data){

    data['adminUserId'] = this.adminUserId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/updateAdminTimeAndStatus',
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

}
