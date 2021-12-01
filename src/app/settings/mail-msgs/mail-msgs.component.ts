import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-mail-msgs',
  templateUrl: './mail-msgs.component.html',
  styleUrls: ['./mail-msgs.component.scss']
})
export class MailMsgsComponent implements OnInit {
  updatedby:any;
  role:any;
  addMailContent : FormGroup;
  msgData = [];
  isEdit = false;
  contentId:any;
  searchTerm;
  showAccept = true;
  page = 1;
  total: any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addMailContent = this.formBuilder.group({
      key: [''],
      message: [''],
      description: [''],
    });
    this.fetchMsgData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[12].write
      // console.log("prer", contentPermssion[12])
    }
  }

  fetchMsgData(){
    let params = {
      url: "admin/getAllMessages",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.msgData = resu.data;
        this.total = this.msgData.length

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    }); 
  }

  addNewMsg(stringModel: any){
    this.isEdit = false;
    this.addMailContent.reset();
    this.modalService.open(stringModel, { centered: true });

  }

  onSubmit(){
    if(this.isEdit){
      this.msgtEditService(this.addMailContent.value)
      return;
    }

    const postData = this.addMailContent.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/addNewMessages',
      data: postData
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.modalService.dismissAll();
          this.addMailContent.reset();
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

  viewMsgs(data,stringModel: any){
    this.modalService.open(stringModel, { centered: true });

    this.isEdit = true;

    this.contentId = data['_id']
    this.addMailContent   = this.formBuilder.group({
      key: [data['key']],
      message: [data['message']],
      description: [data['description']],
    })
  }

  msgtEditService(data){
    data['messageId'] = this.contentId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;


    var params = {
      url: 'admin/editMessagesById',
      data: data
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.isEdit = false;
          this.modalService.dismissAll();
          this.addMailContent.reset();
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

  onDeleteMsg(id){
    const object = {}

    object['messageId'] = id;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/deleteMessageById',
     data: object
   }
  //  console.log("da",params)
   this.apiCall.commonPostService(params).subscribe(
     (response: any) => {
       if (response.body.error == false) {
         // Success
         this.apiCall.showToast("Deleted Successfully", 'Success', 'successToastr')
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
