import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder,FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bill-generation',
  templateUrl: './bill-generation.component.html',
  styleUrls: ['./bill-generation.component.scss']
})
export class BillGenerationComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  searchTerm;
  billList = [];
  permName:any;
  isTimeBasedWirte:boolean;
  canWrite:boolean;
  showAccept:boolean;
  approveAccept:boolean;
  majorWrite:boolean;
  requestWrite:boolean;
  page = 1;
  total: any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Invoice List', active: true }];

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.fetchBillList();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') == 's_a_r'){
      this.majorWrite = true;
    }
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let creatorPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = creatorPermssion[10].write
      this.approveAccept = creatorPermssion[10]._with_Approval_
      this.permName = creatorPermssion[10].permissionName
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

  fetchBillList(){
    let params = {
      url: "admin/getAllBillDetails",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.billList = resu.data;
        this.total = this.billList.length

        // console.log("ef",this.billList)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }


}
