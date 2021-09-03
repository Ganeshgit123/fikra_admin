import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-start-banner',
  templateUrl: './start-banner.component.html',
  styleUrls: ['./start-banner.component.scss']
})
export class StartBannerComponent implements OnInit {
  bannerLeftCont: FormGroup;
  updatedby:any;
  role:any;
  showAccept = true;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.bannerLeftCont = this.formBuilder.group({
      headName: [''],
      description: [''],
      headNameAr: [''],
      descriptionAr: [''],
      buttonName: [''],
      buttonNameAr: [''],
      buttonURL: [''],
    });

    this.fetchTopContent();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchTopContent(){
    let params = {
      url: "admin/get_start_project_list",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.bannerLeftCont = this.formBuilder.group({
          headName: [resu.data.topSection[0].headName,[]],
          headNameAr: [resu.data.topSection[0].headNameAr,[]],
          description: [resu.data.topSection[0].description,[]],
          descriptionAr: [resu.data.topSection[0].descriptionAr,[]],
          buttonName: [resu.data.topSection[0].buttonName,[]],
          buttonNameAr: [resu.data.topSection[0].buttonNameAr,[]],
          buttonURL: [resu.data.topSection[0].buttonURL,[]],
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  bannerCont(){
    const postData = this.bannerLeftCont.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/post_Top_startAProject',
      data: postData
    }
    // console.log("data",params)
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
