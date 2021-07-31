import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.scss']
})
export class ViewProjectsComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  projectId:any;
  tagList=[];
  addTags:FormGroup;
  updatedby:any;
  role:any;
  some:any;

  constructor(private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.breadCrumbItems = [{ label: 'Projects' },{ label: 'Project Details', active: true }];
    this.route.params.subscribe(params => this.projectId = params.id);

    this.addTags = this.formBuilder.group({
      tagsArray: [''],
    });

    this.fetchtagArray();

    this.fetchTagList();

  }

  fetchtagArray(){
    let params = {
      url: "admin/getProjectListById",
      projectId : this.projectId
    }  
    this.apiCall.projectGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        
            var array = resu.data
            array.forEach(element => {
            this.some = element.tags
              });

              this.addTags = this.formBuilder.group({
                tagsArray: [this.some,[]],
              });
          
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  fetchTagList(){
    let params = {
      url: "admin/getAllTag",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.tagList = resu.data;
        // console.log("ef",this.tagList)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  addTagSubmit(){
    // console.log("values",typeof this.addTags.value)
    const tagValue = this.addTags.value.tagsArray

    const postData = {tagsArray:[]};
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;
    postData['projectId'] = this.projectId;
    postData['tagsArray'] = tagValue.join('|')
    
    
    var params = {
      url: 'admin/addTagstoProjects',
      data: postData
    }
    console.log("ppa",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        console.log("res",response)
        if (response.body.error == false) {

          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.ngOnInit();
        } else {
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
