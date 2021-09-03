import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
declare var $:any;

@Component({
  selector: 'app-featured-takingoff',
  templateUrl: './featured-takingoff.component.html',
  styleUrls: ['./featured-takingoff.component.scss']
})
export class FeaturedTakingoffComponent implements OnInit {
  updatedby:any;
  role:any;
  addFeatured: FormGroup;
  showAccept = true;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService    ) { }


  ngOnInit(): void {

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');


    this.addFeatured = this.formBuilder.group({
      featurecontent: [''],
      featurecontent_ar: [''],
      takingOfContent: [''],
      takingOfContent_ar: [''],
    });

    this.fetchfeatureData();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchfeatureData(){
    let params = {
      url: "admin/getHomeFeature",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.addFeatured = this.formBuilder.group({
          featurecontent: [resu.data.featurecontent,[]],
          featurecontent_ar: [resu.data.featurecontent_ar,[]],
          takingOfContent: [resu.data.takingOfContent,[]],
          takingOfContent_ar: [resu.data.takingOfContent_ar,[]],
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onSubmit(){
    const postData = this.addFeatured.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;
    postData['_isFeaturContentOn_'] = true
    postData['_isTakingOn_'] = true

    var params = {
      url: 'admin/postFeatureAndTakingContentandUpdate',
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
