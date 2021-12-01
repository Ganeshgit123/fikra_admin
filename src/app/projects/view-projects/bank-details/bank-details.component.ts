import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
  projectId:any;
  bankName:any;
  acNumber:any;
  iban:any;
  
  constructor(private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
      this.route.params.subscribe(params => this.projectId = params.id);
  
      this._fetchBankInfo();
    }

    _fetchBankInfo(){
      let params = {
        url: "admin/getProjectListById",
        projectId : this.projectId
      }  
      this.apiCall.projectGetService(params).subscribe((result:any)=>{
        let resu = result.body;
        if(resu.error == false)
        {
           this.bankName = resu.data.bankName;
           this.acNumber = resu.data.accountNumber;
           this.iban = resu.data.iban;
          //  console.log("list",resu.data.bankName)
         
        }else{
          this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
        }
      },(error)=>{
         console.error(error);
         
      });
    }

}
