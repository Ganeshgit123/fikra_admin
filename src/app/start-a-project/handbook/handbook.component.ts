import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-handbook',
  templateUrl: './handbook.component.html',
  styleUrls: ['./handbook.component.scss']
})
export class HandbookComponent implements OnInit {
  handbook: FormGroup;
  updatedby:any;
  role:any;
  videoStatus:any;
  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');
    this.handbook = this.formBuilder.group({
      head: [''],
      body: [''],
      headAr: [''],
      bodyAr: [''],
    });

    this.fetchHandbookContent();

  }

  fetchHandbookContent(){
    let params = {
      url: "admin/get_start_project_list",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      console.log("con",resu)
      if(resu.error == false)
      {
        this.handbook = this.formBuilder.group({
          head: [resu.data.creatorHandbook[0].head,[]],
          body: [resu.data.creatorHandbook[0].body,[]],
          headAr: [resu.data.creatorHandbook[0].headAr,[]],
          bodyAr: [resu.data.creatorHandbook[0].bodyAr,[]],
        });


      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  handbookSubmit(){
    const postData = this.handbook.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postHandBookContent',
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
