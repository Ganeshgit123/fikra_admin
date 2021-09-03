import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Form} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

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
  permissionData:any;
  roleIdByclick:any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Roles' },{ label: 'Permissions', active: true }];
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

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
        // console.log("data",this.roleData)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  roleClick(id){
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


  read_update_change(event, permisionId,write,appr_stat){
    console.log(event.currentTarget.checked)
    if(event.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
    
    var data= {}
    data['roleId']=this.roleIdByclick
    data['permissionId']=permisionId
    data['read'] = visible
    data['write'] = write
    data['_with_Approval_'] = appr_stat
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = 
    {
      url: 'admin/updateRolePermissions',
      data: data,  
    }
 console.log("data",params)
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

  write_update_change(event, permisionId,read,appr_stat){
    if(event.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
    var data= {}
    data['roleId']=this.roleIdByclick
    data['permissionId']=permisionId
    data['read'] = read
    data['write'] = visible
    data['_with_Approval_'] = appr_stat
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = 
    {
      url: 'admin/updateRolePermissions',
      data: data,  
    }
 
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

}
