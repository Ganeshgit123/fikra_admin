import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  addUserData:FormGroup;
  userData:any;
  roleData:any;
  roleNameForUser:any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Users List', active: true }];

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addUserData = this.formBuilder.group({
      faq_Header: [''],
      faq_Header_ar: [''],
      faq_Body: [''],
      faq_Body_ar: [''],
    });

    this.fetchUserData();

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

  fetchUserData(){
    let params = {
      url: "admin/getAllAdminUserDetails",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.userData = resu.data;

        this.userData.forEach(element => {
              var adminRole = element.systemAdminRoleId
              this.roleNameForUser = adminRole.roleName
        });
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    }); 
  }

  addUsers(userCorner: any){
    this.modalService.open(userCorner, { centered: true });

  }

  onSubmit(){

  }

}
