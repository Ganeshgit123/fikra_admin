import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from "sweetalert2";
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

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
  quesAnsId:any;
  searchTerm;
  quesList = [];
  showAccept = true;
  page = 1;
  total: any;
  searchTerm1;
  total1: any;
  sum = 0;  

  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
 }

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
      titleAr: [''],
    });

    this.addNewQuesAns = this.formBuilder.group({
      question: [''],
      questionAr: [''],
      answer: [''],
      answerAr: [''],
      ebookId: [''],
    });

    this.fetchTitleList();
    this.callRolePermission(); 
  }
  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
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
        this.total = this.titleList.length;
      //  console.log("book",this.titleList)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  addTitle(helpTilteModal: any){
    this.addNewTitle.reset();
    this.isEdit = false;
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
      titleAr: [data['titleAr']],
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
    Swal.fire({
      title: "Are you sure?",
      text: "This title related Question and Answers also Deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#34c38f",
      cancelButtonColor: "#ff3d60",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        // console.log("id", id);
        const data = {}

        data['ebookId'] = id
        data['createdBy'] = this.updatedby;
        data['userType'] = "admin";
        data['role'] = this.role;
    
        var params = {
          url: 'admin/RemoveEbookTitle',
          data: data
        }
        // console.log("fef",params)
        this.apiCall.commonPostService(params).subscribe(
          (response: any) => {
            if (response.body.error == false) {
              // Success
              Swal.fire("Deleted!", "Your Title has been deleted.", "success");
              // this.apiCall.showToast('Status Updated Successfully', 'Success', 'successToastr')
              this.ngOnInit();
            } else {
              // Query Error
              this.apiCall.showToast(
                response.body.message,
                "Error",
                "errorToastr"
              );
            }
          },
          (error) => {
            this.apiCall.showToast("Server Error !!", "Oops", "errorToastr");
            console.log("Error", error);
          }
        );
      }
    });
  }

  addQuesAns(quesAnsModal: any){
    this.addNewQuesAns.reset();
    this.isEditQues = false;
    this.modalService.open(quesAnsModal, { centered: true,size:'lg' });
  }


  addQuesAnsSubmit(){

    if(this.isEditQues){
      this.quesAnsEditService(this.addNewQuesAns.value)
      return;
    }
    
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

  viewQuesAns(data,quesdata,quesAnsModal: any){
    this.modalService.open(quesAnsModal, { centered: true,size:'lg' });
    this.isEditQues = true;
    this.titleIdQuesAns = data['_id'];
    this.quesAnsId = quesdata['_id'];

    this.addNewQuesAns   = this.formBuilder.group({
      question: [quesdata['question']],
      questionAr: [quesdata['questionAr']],
      answer: [quesdata['answer']],
      answerAr: [quesdata['answerAr']],
      ebookId: [this.titleIdQuesAns],
    })
    
  }

  quesAnsEditService(data){
    data['questionId'] = this.quesAnsId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/editEbookQuestionAnswer',
      data: data
    }
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

  deleteQuesAns(ebookid,queid){
    const object = {}

    object['questionId'] = queid;
    object['ebookId'] = ebookid;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/removeQuestionFromEbook',
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
