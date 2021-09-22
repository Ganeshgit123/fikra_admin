import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ApiCallService } from "../services/api-call.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: "app-template",
  templateUrl: "./template.component.html",
  styleUrls: ["./template.component.scss"],
})
export class TemplateComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  updatedby: any;
  role: any;
  templateContent: FormGroup;
  contentForm: FormGroup;
  container = [];
  isCollapsed = true;
  projectDetails = [];
  templateDetails = [];
  projecOneId: any;
  projecTwoId: any;
  projecThreeId: any;
  templateId:any;

  constructor(
    private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');
    this.breadCrumbItems = [{ label: "Templates", active: true }];

    this.templateContent = this.formBuilder.group({
      textHead: '',
      textContent: '',
      project_One: null,
      project_Two: null,
      project_Three: null,
      learnMore_URL: '',
    });

    this.contentForm = this.formBuilder.group({
      templateName: '',
    });


    this.fetchTemplateData();


    this.getProjectInfo();
  }

  getProjectInfo() {
    let params = {
      url: "admin/listProject",
    }
    this.apiCall.smallGetService(params).subscribe((result: any) => {
      let resu = result.body;
      if (resu.error == false) {
        this.projectDetails = resu.data
      }
    }, (error) => {
      console.error(error);

    });
  }

  onSubmitContent() {
    if (this.templateContent.value['textHead'] !== '') {
      this.container.push(this.templateContent.value)
      this.templateContent = this.formBuilder.group({
        textHead: '',
        textContent: '',
        project_One: null,
        project_Two: null,
        project_Three: null,
        learnMore_URL: '',
      });

    } else {
      this.contentForm.value.content = []
      this.apiCall.showToast("Can't process with empty Header", 'Error', 'errorToastr')
    }
  }


  onRemove(index) {
    if (index != -1) {
      this.container.splice(index, 1)
    }
  }

  previewOpen(param: any) {
    this.modalService.open(param, { centered: true, backdrop: true, size: 'xl' });
    // console.log(this.container);
    // console.log(this.contentForm);
  }


  addTemplate() {

    this.modalService.dismissAll();
    this.contentForm.value.content = this.container
    if (this.contentForm.value.content !== '') {

      this.contentForm.value.content.forEach((element, index) => {

        this.projecOneId = element.project_One._id
        this.projecTwoId = element.project_Two._id
        this.projecThreeId = element.project_Three._id

        this.contentForm.value.content[index].project_One = this.projecOneId
        this.contentForm.value.content[index].project_Two = this.projecTwoId
        this.contentForm.value.content[index].project_Three = this.projecThreeId
      });
      // console.log("fir",this.projecOneId)
      const postData = this.contentForm.value;
      postData['createdBy'] = this.updatedby;
      postData['userType'] = "admin";
      postData['role'] = this.role;

      var params = {
        url: 'admin/addTemplateContent',
        data: postData
      }
      // console.log("data",params)
      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
          if (response.body.error == false) {
            this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
            this.ngOnInit();
            this.isCollapsed = true;
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


  fetchTemplateData() {
    let params = {
      url: "admin/getAllTemplate",
    }
    this.apiCall.commonGetService(params).subscribe((result: any) => {
      let resu = result.body;
      if (resu.error == false) {
        this.templateDetails = resu.data
      }
    }, (error) => {
      console.error(error);

    });
  }

  clickTempData(item){
    // console.log("item",item)
    this.templateId = item._id
    item.isEdit = true
    this.apiCall.templateValue(item)
   }

}