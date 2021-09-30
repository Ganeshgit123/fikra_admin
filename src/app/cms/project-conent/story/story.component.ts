import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  updatedby:any;
  role:any;
  addStoryContent: FormGroup;

 constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addStoryContent = this.formBuilder.group({
      tabName: [''],
      tabName_Ar: [''],
      tabHead: [''],
      tabHead_Ar: [''],
      description: [''],
      description_Ar: [''],
      projectStoryHead: [''],
      projectStoryHead_Ar: [''],
      projectStoryDescr: [''],
      projectStoryDescr_Ar: [''],
      riskHead: [''],
      riskHead_Ar: [''],
      riskDescr: [''],
      riskDescr_Ar: [''],
    });

    this.fetchBasicsData();
  }

  fetchBasicsData(){
    let params = {
      url: "admin/getProjectStoryContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.addStoryContent = this.formBuilder.group({
          tabName: [resu.data.tabName,[]],
          tabName_Ar: [resu.data.tabName_Ar,[]],
          tabHead: [resu.data.tabHead,[]],
          tabHead_Ar: [resu.data.tabHead_Ar,[]],
          description: [resu.data.description,[]],
          description_Ar: [resu.data.description_Ar,[]],
          projectStoryHead: [resu.data.projectStoryHead,[]],
          projectStoryHead_Ar: [resu.data.projectStoryHead_Ar,[]],
          projectStoryDescr: [resu.data.projectStoryDescr,[]],
          projectStoryDescr_Ar: [resu.data.projectStoryDescr_Ar,[]],
          riskHead: [resu.data.riskHead,[]],
          riskHead_Ar: [resu.data.riskHead_Ar,[]],
          riskDescr: [resu.data.riskDescr,[]],
          riskDescr_Ar: [resu.data.riskDescr_Ar,[]],

        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onSubmit(){
    const postData = this.addStoryContent.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postProjectStoryPage_CMS',
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