import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder,FormControl } from '@angular/forms';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss']
})
export class SubscribersComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  searchTerm;
  subscribersList=[];

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {

    this.breadCrumbItems = [{ label: 'Subscribers List', active: true }];

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.fetchSubscribersList();
  }

  fetchSubscribersList(){
    let params = {
      url: "admin/getSubscribers",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.subscribersList = resu.data;
        console.log("ef",this.subscribersList)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }
}
