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
  showAccept:boolean;
  approveAccept:boolean;
  majorWrite:boolean;
  requestWrite:boolean;
  permName:any;
  isTimeBasedWirte:boolean;
  canWrite:boolean;
  bankStatus: any;
  featureFromDate: any;
  featuretoDate:any;
  projectSucceed:any;
  requestList:any = [];
  
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

    // this.fetchTagList();
    this._fetchStory();
    this.callRolePermission();
    this.fetchRequestList();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') == 's_a_r'){
      this.majorWrite = true;
    }
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let creatorPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = creatorPermssion[0].write
      this.approveAccept = creatorPermssion[0]._with_Approval_
      this.permName = creatorPermssion[0].permissionName
      this.isTimeBasedWirte = JSON.parse(sessionStorage.getItem('isTimeBasedWirte'));
      this.canWrite =JSON.parse(sessionStorage.getItem('canWrite'));

     if(this.showAccept == true){
      if(this.approveAccept == false && this.isTimeBasedWirte == false){
            this.majorWrite = true;
            console.log("first_condition")
      }else if(this.isTimeBasedWirte === true && this.canWrite === true){
        this.majorWrite = true;
        console.log("second_condition")
      }else if(this.approveAccept == true){
        this.requestWrite = true;
        console.log("request_condition")
      }else{
        this.majorWrite = false;
      console.log("1st_else_condition")
      }
    }else{
      this.majorWrite = false;
      console.log("2nd_else_condition")
    }

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
              this.featureFromDate = resu.data._is_featured_from;
              this.featuretoDate = resu.data._is_featured_to;
              this.projectSucceed = resu.data._is_succeed_;
           console.log("fff",resu.data)
           
            this.homeStatus = resu._is_On_HomeSlide_;

            this.bankStatus = resu.data._isBankAdded_;
          
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

  onchangeRequestRecommednStatus(val){

    if(val == 'true'){
      var valFrom = true
      var valTo = false
    }else{
       valFrom = false
       valTo = true
    }
  const object = {}

  object['createdBy'] = this.updatedby;
 object['userType'] = "admin";
 object['role'] = this.role;
 object['tabName'] = "View Projects";
 object['feildName'] = "Recommended";
 object['valueFrom'] = valFrom;
 object['valueTo'] = valTo;
 object['APIURL'] = "https://fikra.app/api/admin/addAsRecommended";
 object['paramsForAPI'] = {
  ['projectId'] : this.projectId,
  ['_is_Recommeded_'] : val,
 };

  var params = {
   url: 'admin/requsetToSuperAdminForChange',
   data: object
 }
//  console.log("pa",params)
 this.apiCall.commonPostService(params).subscribe(
   (response: any) => {
     if (response.body.error == false) {
       // Success
       this.apiCall.showToast("Request Sent Successfully", 'Success', 'successToastr')
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

  addFeatureReqSubmit(){
   
  const object = {}

  object['createdBy'] = this.updatedby;
 object['userType'] = "admin";
 object['role'] = this.role;
 object['tabName'] = "View Projects";
 object['feildName'] = "Featured Project";
 object['valueFrom'] = "Mark as Featured Project";
 object['valueTo'] = "";
 object['APIURL'] = "https://fikra.app/api/admin/addToFeaturedProject";
 object['paramsForAPI'] = {
  ...this.addFeatureForm.value,
  ['projectId'] : this.projectId
 };

  var params = {
   url: 'admin/requsetToSuperAdminForChange',
   data: object
 }
//  console.log("pa",params)
 this.apiCall.commonPostService(params).subscribe(
   (response: any) => {
     if (response.body.error == false) {
       // Success
       this.apiCall.showToast("Request Sent Successfully", 'Success', 'successToastr')
       this.ngOnInit();
       this.modalService.dismissAll();
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

  commentRequestSubmit(){
    const object = {}

  object['createdBy'] = this.updatedby;
 object['userType'] = "admin";
 object['role'] = this.role;
 object['tabName'] = "View Projects";
 object['feildName'] = "Request Back";
 object['valueFrom'] = "Project Change request to creator";
 object['valueTo'] = "";
 object['APIURL'] = "https://fikra.app/api/admin/sendRequestToUser";
 object['paramsForAPI'] = {
    ['projectId'] : this.projectId,
    ['adminComment'] : this.commentForm.get('adminComment').value,
    ['feildNeedtoEdit'] : this.commentForm.get('feildNeedtoEdit').value,
 };

  var params = {
   url: 'admin/requsetToSuperAdminForChange',
   data: object
 }
//  console.log("pa",params)
 this.apiCall.commonPostService(params).subscribe(
   (response: any) => {
     if (response.body.error == false) {
       // Success
       this.apiCall.showToast("Request Sent Successfully", 'Success', 'successToastr')
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

  addTagRequestSubmit(){

    const tagValue = this.addTags.value.tagsArray


    const object = {tagsArray:[]}

  object['createdBy'] = this.updatedby;
 object['userType'] = "admin";
 object['role'] = this.role;
 object['tabName'] = "View Projects";
 object['feildName'] = "Tagged";
 object['valueFrom'] = "Add Tags";
 object['valueTo'] = "";
 object['APIURL'] = "https://fikra.app/api/admin/addTagstoProjects";
 object['paramsForAPI'] = {
  ['projectId'] : this.projectId,
  ['tagsArray'] : tagValue.join('|')
 };

  var params = {
   url: 'admin/requsetToSuperAdminForChange',
   data: object
 }
//  console.log("pa",params)
 this.apiCall.commonPostService(params).subscribe(
   (response: any) => {
     if (response.body.error == false) {
       // Success
       this.apiCall.showToast("Request Sent Successfully", 'Success', 'successToastr')
       this.ngOnInit();
       this.modalService.dismissAll();
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

  fetchRequestList(){
    let params = {
      url: "admin/getSendRequestListByprojectId",
      projectId : this.projectId
    }  
    this.apiCall.projectGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
         this.requestList = resu.data;
         console.log("req",this.requestList)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

}
