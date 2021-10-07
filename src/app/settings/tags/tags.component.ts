import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  addTags:FormGroup;
  updatedby:any;
  role:any;
  isEdit = false;
  tagList=[];
  tagId:any;
  deleteStat:any;
  visibleStat:any;
  showAccept = true;
  searchTerm;
  page = 1;
  total: any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addTags = this.formBuilder.group({
      tagName: [''],
      tagNameAr: [''],
    });

    this.fetchTagList();

    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = settingPermssion[4].write
      // console.log("prer", settingPermssion[4])
    }
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
        this.total = this.tagList.length
        // console.log("ef",this.tagList)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  addTagsModal(centerDataModal: any){
    this.modalService.open(centerDataModal, { centered: true });
  }

  addTagSubmit(){

    if(this.isEdit){
      this.tagEditService(this.addTags.value)
      return;
    }

    const postData = this.addTags.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/addTags',
      data: postData
    }
    // console.log("ppa",params)
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

  viewTags(data,centerDataModal: any){
    this.modalService.open(centerDataModal, { centered: true });
    this.isEdit = true;

    this.tagId = data['_id'];
    this.deleteStat = data['_is_Deleted_'];
    this.visibleStat = data['_is_visible_'];
    this.addTags   = this.formBuilder.group({
      tagName: [data['tagName']],
      tagNameAr: [data['tagNameAr']],
    })
  }

  tagEditService(data){
    data['tagId'] = this.tagId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['_is_Deleted_'] = this.deleteStat;
    data['_is_visible_'] = this.visibleStat;

    var params = {
      url: 'admin/editTags',
      data: data
    }

    // console.log("par",params)
    this.apiCall.commonPutService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.isEdit = false;
          this.modalService.dismissAll();
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

  deleteTag(data){
  //  console.log("dd",data)

   if( data['_is_Deleted_'] === false){
    var deleteTag = true
   }else{
    var deleteTag = false
   }
  
    const object = {}
    
    object['tagId'] = data['_id']
    object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;
    object['_is_Deleted_'] = deleteTag;
    object['_is_visible_'] = data['_is_visible_'];
    object['tagName'] = data['tagName'];
    object['tagNameAr'] = data['tagNameAr'];

    var params = {
      url: 'admin/editTags',
      data: object
    }

    // console.log("par",params)
    this.apiCall.commonPutService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast('Deleted Successfully', 'Success', 'successToastr')
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

  onchangeTagStatus(values:any,data){

    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }

     const object = {}

     object['tagId'] = data['_id']
    object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;
    object['_is_Deleted_'] = data['_is_Deleted_'];;
    object['_is_visible_'] = visible
    object['tagName'] = data['tagName'];
    object['tagNameAr'] = data['tagNameAr'];

     var params = {
      url: 'admin/editTags',
      data: object
    }
    // console.log("fef",params)
    this.apiCall.commonPutService(params).subscribe(
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
}
