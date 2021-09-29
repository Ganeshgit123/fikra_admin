import { Component, OnInit,  } from "@angular/core";
import { ApiCallService } from "../services/api-call.service";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: "app-subscribers",
  templateUrl: "./subscribers.component.html",
  styleUrls: ["./subscribers.component.scss"],
})

export class SubscribersComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby: any;
  role: any;
  searchTerm;
  newsletterData:FormGroup;
  subscribersList = [];
  subscriberId = [];
  templateDetails = [];
  templateId = '';
  isAllSelect = false;
  htmlElement : any;
  DataTemplete: any;
  editorData = '<p>Hello, world!</p>';
  public Editor = DecoupledEditor;
  public onReady( editor ) {
     editor.ui.getEditableElement().parentElement.insertBefore(
         editor.ui.view.toolbar.element,
         editor.ui.getEditableElement()
     );
  }
  constructor(
    private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: "Subscribers List", active: true }];

    this.updatedby = sessionStorage.getItem("adminId");
    this.role = sessionStorage.getItem("adminRole");

    this.newsletterData = this.formBuilder.group({
      emailIds:'',
      htmlContent:''
    });
    
    this.fetchSubscribersList();
    this.fetchTemplateData();
  }

  changeTemplate(element){
    this.DataTemplete = this.templateDetails.find(ele => ele._id == element);
    console.log(this.DataTemplete)
  }

  fetchTemplateData() {
    let params = {
      url: "admin/getAllTemplate",
    }
    this.apiCall.commonGetService(params).subscribe((result: any) => {
      let resu = result.body;
      if (resu.error == false) {
        this.templateDetails = resu.data
        console.log("temp",this.templateDetails)
      }
    }, (error) => {
      console.error(error);
    });
  }

  fetchSubscribersList() {
    let params = {
      url: "admin/getSubscribers",
    };
    this.apiCall.commonGetService(params).subscribe(
      (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          this.subscribersList = resu.data;
        } else {
          this.apiCall.showToast(resu.message, "Error", "errorToastr");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  onInputChange(id) {
    let index = this.subscriberId.indexOf(id);
    if (index > -1) {
      this.subscriberId = this.removeItemOnce(this.subscriberId, id);
    } else {
      this.subscriberId.push(id);
    }
    
    if(this.subscriberId.length == this.subscribersList.length){
      this.isAllSelect = true
    }else{
      this.isAllSelect = false 
    }
  }

  nesletterOpen(param: any){
    this.htmlElement = document.getElementById('needTosend').outerHTML
    this.modalService.open(param, { centered: true, backdrop: true, size: 'xl' });
  }

  onSubmit(){
    this.htmlElement = document.getElementById('newsletterTemp').outerHTML
    this.newsletterData.value['htmlContent']= this.htmlElement
    this.newsletterData.value['emailIds']= this.subscriberId.join(" | ")

    const postData = this.newsletterData.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/sendNewsletterToUser',
      data: postData
    }
    
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.modalService.dismissAll();
          this.subscriberId = []
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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

  async onSelectAll(){
    this.isAllSelect = !this.isAllSelect;
    if(this.isAllSelect){
      //selection
        await this.subscribersList.map(async(element) => {
          await this.subscriberId.push(element.email)
        });
    }else{
      //deselection
      this.subscriberId = [];
    }
  }


}
