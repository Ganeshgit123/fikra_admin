import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-creator-handbook',
  templateUrl: './creator-handbook.component.html',
  styleUrls: ['./creator-handbook.component.scss']
})
export class CreatorHandbookComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby:any;
  role:any;
  imagePreview = null;
  fileUpload: any;
  addHandbookData:FormGroup;
  handBookData:any;
  imgUrl:any;
  isEdit:any;
  handBookId:any;
  showAccept = true;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Creator Handbook', active: true }];

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addHandbookData = this.formBuilder.group({
      handbookImg: [''],
      handBookHead: [''],
      handBookBody: [''],
      handBookHeadAr: [''],
      handBookBodyAr: [''],
    });

    this.fetchHandbookData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchHandbookData(){
    let params = {
      url: "admin/getAllHandbooks",
    }  
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {

        this.handBookData = response.body.data;
// console.log("dd",this.createCornerData)
      }else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }


  onchangeHandbookStatus(values:any,val){
    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['handBookId'] = val;
     object['_is_Visible_'] = visible;
     object['_is_Deleted_'] = false;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/updateHandbookforUserStatus',
      data: object
    }
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

  // onDeleteHandbookStatus(val,id,visible){
  //   const object = {}

  //   object['handBookId'] = id;
  //   object['_is_Visible_'] = visible;
  //   object['_is_Deleted_'] = val;
  //   object['createdBy'] = this.updatedby;
  //  object['userType'] = "admin";
  //  object['role'] = this.role;

  //   var params = {
  //    url: 'admin/updateHandbookforUserStatus',
  //    data: object
  //  }
  // //  console.log("da",params)
  //  this.apiCall.commonPostService(params).subscribe(
  //    (response: any) => {
  //      if (response.body.error == false) {
  //        // Success
  //        this.apiCall.showToast("Deleted Successfully", 'Success', 'successToastr')
  //        this.ngOnInit();
  //      } else {
  //        // Query Error
  //        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
  //      }
  //    },
  //    (error) => {
  //      this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
  //      console.log('Error', error)
  //    }
  //  )
  // }
}
