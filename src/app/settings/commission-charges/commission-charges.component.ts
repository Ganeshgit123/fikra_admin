import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
declare var $:any;

@Component({
  selector: 'app-commission-charges',
  templateUrl: './commission-charges.component.html',
  styleUrls: ['./commission-charges.component.scss']
})
export class CommissionChargesComponent implements OnInit {
  updatedby:any;
  role:any;
  addCommission: FormGroup;
  showAccept = true;

 constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService    ) { }

  ngOnInit(): void {


    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');


    this.addCommission = this.formBuilder.group({
      processing_Fees: [''],
      VAT: [''],
      keepItAllCommission: [''],
      allAreNothingCommission: [''],
    });

    this.fetchCommissionData();
    this.callRolePermission();

  }


  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = settingPermssion[4].write
      // console.log("prer", settingPermssion[4])
    }
  }

  fetchCommissionData(){
    let params = {
      url: "admin/getAllChargesList",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.addCommission = this.formBuilder.group({
          processing_Fees: [resu.data.processing_Fees,[]],
          VAT: [resu.data.VAT,[]],
          keepItAllCommission: [resu.data.keepItAllCommission,[]],
          allAreNothingCommission: [resu.data.allAreNothingCommission,[]],
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onSubmit(){
    const postData = this.addCommission.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/addCharges',
      data: postData
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')

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
