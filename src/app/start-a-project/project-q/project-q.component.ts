import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-project-q',
  templateUrl: './project-q.component.html',
  styleUrls: ['./project-q.component.scss']
})
export class ProjectQComponent implements OnInit {
  projectTitle: FormGroup;
  addQues: FormGroup;
  updatedby:any;
  role:any;
  quesAndAnsList:any;
  isEdit = false;
  quesAndAnId:any;
  questionStatus:any;

  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private apiCall: ApiCallService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');
    this.projectTitle = this.formBuilder.group({
      headName: [''],
      headNameAr: [''],
    });

    this.addQues = this.formBuilder.group({
      question: [''],
      questionAr: [''],
      answer: [''],
      answerAr: [''],
    });

    this.fetchTopContent();

  }

  fetchTopContent(){
    let params = {
      url: "admin/get_start_project_list",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.projectTitle = this.formBuilder.group({
          headName: [resu.data.questions[0].headName,[]],
          headNameAr: [resu.data.questions[0].headNameAr,[]],
        });

        this.quesAndAnsList = resu.data.questions[0].questionBody;
        
        this.questionStatus = resu.data._is_question_on_;

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  addQuesAndAns(addQuesAns: any){
    this.modalService.open(addQuesAns, { centered: true });
  }

  projTitleSubmit(){
    const postData = this.projectTitle.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/post_Qestions_head_startAProject',
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


  addQuesSubmit(){

    if(this.isEdit){
      this.quesEditService(this.addQues.value)
      return;
    }

    const postData = this.addQues.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/add_Questions_Answers',
      data: postData
    }
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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

  viewQuesandAns(data,addQuesAns: any){
    this.modalService.open(addQuesAns, { centered: true });

    this.isEdit = true;

    this.quesAndAnId = data['_id']
    this.addQues   = this.formBuilder.group({
      question: [data['question']],
      questionAr: [data['questionAr']],
      answer: [data['answer']],
      answerAr: [data['answerAr']],
    })
  }

  quesEditService(data){

    data['questionId'] = this.quesAndAnId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/edit_Questions_Answers',
      data: data
    }
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

  onchangeQuesAnsStatus(values:any,val){

    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['questionId'] = val;
     object['_is_on_'] = visible;
     object['_is_Deleted_'] = false;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/edit_Questions_Answers_Status',
      data: object
    }
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

  onDeleteQuesAndAnsStatus(val,id,visible){
    const object = {}

    object['questionId'] = id;
    object['_is_on_'] = visible;
    object['_is_Deleted_'] = val;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/edit_Questions_Answers_Status',
     data: object
   }
  //  console.log("da",params)
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

  onchangeQuesStatus(values:any){
    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['_is_question_on_'] = visible;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/status_Question_startAProject',
      data: object
    }
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
