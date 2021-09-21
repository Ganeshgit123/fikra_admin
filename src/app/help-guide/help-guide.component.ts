import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-help-guide',
  templateUrl: './help-guide.component.html',
  styleUrls: ['./help-guide.component.scss']
})
export class HelpGuideComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  addNewTitle:FormGroup;
  updatedby:any;
  role:any;
  titleList = [];
  isEdit = false;
  titleId:any;
  addNewQuesAns:FormGroup;
  isEditQues = false;
  titleIdQuesAns:any;
  quesId:any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'CMS' }, { label: 'Help Guide', active: true }];
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addNewTitle = this.formBuilder.group({
      title: [''],
    });

    this.addNewQuesAns = this.formBuilder.group({
      question: [''],
      answer: [''],
      ebookId: [''],
    });

    this.fetchTitleList();
    
  }

  fetchTitleList(){
    let params = {
      url: "admin/getAllEbook",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.titleList = resu.data;
        // console.log("ef",this.titleList)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  addTitle(helpTilteModal: any){
    this.modalService.open(helpTilteModal, { centered: true });
  }

  addTitleSubmit(){
    if(this.isEdit){
      this.titleEditService(this.addNewTitle.value)
      return;
    }
    const postData = this.addNewTitle.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/addTtileForEbook',
      data: postData
    }
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

  viewTitle(data,helpTilteModal: any){
    this.modalService.open(helpTilteModal, { centered: true });
    this.isEdit = true;
    this.titleId = data['_id'];
    this.addNewTitle = this.formBuilder.group({
      title: [data['title']],
    })
  }

  titleEditService(data){
    data['ebookId'] = this.titleId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/editEbookTitle',
      data: data
    }

    // console.log("par",params)
    this.apiCall.commonPostService(params).subscribe(
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

  onchangeTitleStatus(values:any,id){
    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }

    //  console.log("boole",visible)
     const object = {}

     object['ebookId'] = id;
     object['_is_On_'] = visible;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/updateBookStatus',
      data: object
    }
    // console.log("fef",params)
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

  deleteTitle(id){
    
    const data = {}

    data['ebookId'] = id
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/RemoveEbookTitle',
      data: data
    }

    // console.log("par",params)
    this.apiCall.commonPostService(params).subscribe(
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

  addQuesAns(quesAnsModal: any){
    this.modalService.open(quesAnsModal, { centered: true });
  }


  addQuesAnsSubmit(){
    const postData = this.addNewQuesAns.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/addQuestionAnswerForEbook',
      data: postData
    }
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

  viewQuesAns(data,quesAnsModal: any){
    this.modalService.open(quesAnsModal, { centered: true });
    this.isEditQues = true;
    this.titleIdQuesAns = data['_id'];

    data.question.forEach((element,index) => {
        var ques = element.question;
        var ans = element.answer;
        this.quesId = element._id;

        this.addNewQuesAns = this.formBuilder.group({
          question: [ques],
          answer: [ans],
          ebookId: [ this.titleIdQuesAns],
        })
    });
    
  }


  onchangeQuesAnsStatus(values:any,id,quesid){
    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }

    //  console.log("boole",visible)
     const object = {}

     object['ebookId'] = id;
     object['questionId'] = quesid;
     object['_is_On_'] = visible;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/updateStatusForEbookQuestions',
      data: object
    }
    // console.log("fef",params)
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
}
