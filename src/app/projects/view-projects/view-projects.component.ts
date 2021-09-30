import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  commentForm:FormGroup;
  updatedby:any;
  role:any;
  recommend:any;
  feature:any;
  addFeatureForm:FormGroup;
  homeStatus:any;
  projectList: any=[];
  showAccept = true;

  constructor(private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.breadCrumbItems = [{ label: 'Projects' },{ label: 'Project Details', active: true }];
    this.route.params.subscribe(params => this.projectId = params.id);

    this.addTags = this.formBuilder.group({
      tagsArray: [''],
    });
    
    this.commentForm = this.formBuilder.group({
      adminComment: [''],
      feildNeedtoEdit: [''],
    });

    this.addFeatureForm = this.formBuilder.group({
      fromDate: [''],
      toDate: [''],
    });


    this.fetchtagArray();

    this.fetchTagList();
    this._fetchStory();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let projectPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = projectPermssion[0].write
      // console.log("prer", this.showAccept)
    }
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
        
            var array = resu.data.tags

             
              this.addTags = this.formBuilder.group({
                tagsArray: [array,[]],
              });
              this.recommend = resu.data._is_Recommeded_;
              this.feature = resu.data._is_featured_;

            this.homeStatus = resu._is_On_HomeSlide_
              // console.log("roc",this.homeStatus)
          
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
    // console.log("ppa",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        // console.log("res",response)
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

  onchangeRecommednStatus(values:any){

     const object = {}

     object['_is_Recommeded_'] = values;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;
    object['projectId'] = this.projectId; 

     var params = {
      url: 'admin/addAsRecommended',
      data: object
    }
    // console.log("dd",object)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast("Changed Successfully", 'Success', 'successToastr')
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

  commentSubmit(){
    const data = {}
    data['projectId'] = this.projectId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['adminComment'] = this.commentForm.get('adminComment').value;
    data['feildNeedtoEdit'] = this.commentForm.get('feildNeedtoEdit').value;

    var params = {
      url: 'admin/sendRequestToUser',
      data: data
    }
    // console.log("fef",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast('Comment Sent Successfully', 'Success', 'successToastr')
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

  addFeature(centerDataModal: any){
    this.modalService.open(centerDataModal, { centered: true });
  }

  addFeatureSubmit(){
    const postData = this.addFeatureForm.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;
    postData['projectId'] = this.projectId

    var params = {
      url: 'admin/addToFeaturedProject',
      data: postData
    }
// console.log("ddd",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {

          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.modalService.dismissAll();
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



  _fetchStory(){
    let params = {
      url: "admin/getProjectListById",
      projectId : this.projectId
    }  
    this.apiCall.projectGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
         this.projectList = resu.data.storyTableId;

          // this.storyArray.push(this.projectList)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

}
