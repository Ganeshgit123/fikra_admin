import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder,FormControl } from '@angular/forms';

import { AdvancedSortableDirective} from '../services/advanced-sortable.directive';

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.scss'],
  providers: [DecimalPipe]
})

export class InvestorsComponent implements OnInit {
 // bread crum data
 breadCrumbItems: Array<{}>;
 updateInvestor: FormGroup;
 _user_ID_ : any;

 getuserList: any=[];
 getfieldList: any=[];
 fieldata:any;
 fieldId:any;
 userFiedld :any;
 userFeed: any;
 filedid:any;
 datalist:any;
 new_arr: any=[];
 values:any;
 abc: any=[];
 searchTerm;
 controlName: string;

 accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');


      
 @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

 constructor(private pipe: DecimalPipe,
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,) {

 }


 ngOnInit() {

   this.breadCrumbItems = [{ label: 'Invesors List', active: true }];

   const formGroup = {};

    this.abc.forEach(formControl => {
      formGroup[formControl.controlName] = new FormControl('');
   });

   this.updateInvestor = new FormGroup(formGroup);


   this._fetchData();
 }

 

 _fetchData() {

  let params = {
    url: "admin/getInvestorList",
  }  
  this.apiCall.userGetService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
      this.getfieldList = resu.fields;
      this.getuserList = resu.data;
      // this.getuserList.forEach(element => {
      //   element['isEdit'] = false;
      // });
      // const field_name = this.getfieldList.map((it)=>{
      //   return it.fieldId
      // })

      // this.abc = this.getuserList.map((item)=>{
      //   const a = {}
      //   field_name.forEach((f)=>{
      //     a[f] = item[f]

      //   })
      //   return item = a
      // })

      // console.log("abc",this.abc)

    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });


 }

 getData(item) {
  return Object.keys(item);
}

getTableData(data){
  console.log("fef",data)
  data.isEdit = true;


  //  this._user_ID_ = data['_id'] 

  this.updateInvestor   = this.formBuilder.group({
   fullName: [data['fullName']],
   userName: [data['userName']],
   email: [data['email']],
   mobileNumber: [data['mobileNumber']],
   country: [data['country']],
   city: [data['city']],
   street: [data['street']],
   dob: [data['dob'], ],
   _send_me_newsletter_: [data['_send_me_newsletter_']],
   _is_admin_arroved_: [data['_is_admin_arroved_']],
   _is_mobile_verified_: [data['_is_mobile_verified_']],
   _userRole_: [data['_userRole_']],
   _user_ID_: [data['_id']],
 })


}

close(data){
  data.isEdit = false;
 }

}

