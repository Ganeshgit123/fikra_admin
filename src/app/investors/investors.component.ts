import { Component, OnInit, ViewChildren, QueryList,PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AdvancedSortableDirective, SortEvent,SortDirection } from '../services/advanced-sortable.directive';

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
 sorting: any=[];
 abc: any=[];
 searchTerm;

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

   this._fetchData();

   this.updateInvestor = this.formBuilder.group({
    fullName: ['',  []],
    userName: ['',  []],
    country: ['',  []],
    city: ['',  []],
    street: ['',  []],
    mobileNumber: ['',  []],
    _is_admin_arroved_: ['',  []],
    _is_mobile_verified_: ['',  []],
    _send_me_newsletter_: ['',  []],
    _userRole_: ['',  []],
  });
 }

 

 _fetchData() {

  let params = {
    url: "admin/getUserListWithFilter",
  }  
  this.apiCall.userGetService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
      this.getfieldList = resu.fields;
      this.getuserList = resu.data;

      function arr_diff (a1, a2) {

        var a = [], diff = [];
      
        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }
      
        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }
      
        for (var k in a) {
            diff.push(k);
        }
      
        return diff;
      }
      
      const field_name = this.getfieldList.map((it)=>{
        return it.fieldId
      })
      
      const det = this.getuserList.filter((dt,idx)=>{
        return idx === 0
      })
      
       this.values = Object.keys(det[0]);
      
      let diff_ele = arr_diff(this.values, field_name)
      
      this.new_arr = this.getuserList.filter((item, idx)=>{
        return diff_ele.map((e)=>{
          delete item[e]
        })
        
      })

      this.abc = this.new_arr.map((item)=>{
        const a = {}
        field_name.forEach((f)=>{
          a[f] = item[f]

        })
        return item = a
      })

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

}

