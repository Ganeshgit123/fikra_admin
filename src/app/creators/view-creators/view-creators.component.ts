import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-creators',
  templateUrl: './view-creators.component.html',
  styleUrls: ['./view-creators.component.scss']
})
export class ViewCreatorsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  userId: any;
  getCreatorList = [];
  getCreatorFeilds = [];
  pasDel:any;
  
   constructor(private apiCall: ApiCallService,
  private formBuilder: FormBuilder,
  private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Creators' },{ label: 'Creator Details', active: true }];
    this.route.params.subscribe(params => this.userId = params.id);
    this._fetchData();
    this.fetchCreatorFieldData();

  }

  fetchCreatorFieldData() {
    let params = {
      url: "admin/getCreatorProfileCreationField",
    };
    this.apiCall.commonGetService(params).subscribe(
      (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          this.getCreatorFeilds = resu.data;

          const removeItinerary = (removeId) => {
            const res = this.getCreatorFeilds.filter(obj => obj.fieldId !== removeId);
            return res;
          }
          
          this.pasDel = removeItinerary('password')
          // console.log("pas",this.pasDel)
        } else {
          this.apiCall.showToast(resu.message, "Error", "errorToastr");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
  _fetchData() {
    let params = {
      url: "admin/getUserDetailsById",
      userId: this.userId,
      userRole: "creator",
    };
    this.apiCall.userGetService(params).subscribe(
      (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          this.getCreatorList = resu.data;
          // console.log("ff",this.getCreatorList)
        } else {
          this.apiCall.showToast(resu.message, "Error", "errorToastr");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

}
