import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ApiCallService } from "../services/api-call.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";



@Component({
  selector: "app-template",
  templateUrl: "./template.component.html",
  styleUrls: ["./template.component.scss"],
})
export class TemplateComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  templateContent: FormGroup;
  contentForm:FormGroup;
  container = [];
  projectDetails = []
  
  constructor(
    private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
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

    this.breadCrumbItems = [{ label: "Templates", active: true }];

    this.getProjectInfo()
  }

  getProjectInfo(){
    let params = {
      url: "admin/listProject",
    }  
    this.apiCall.smallGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.projectDetails = resu.data  
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onSubmitContent(){
    if(this.templateContent.value['textHead'] !== ''){
      this.container.push(this.templateContent.value)
      this.templateContent = this.formBuilder.group({
        textHead: '',
        textContent: '',
        project_One: null,
        project_Two: null,
        project_Three: null,
        learnMore_URL: '',
      });
    }else{
      this.contentForm.value.content = []
      this.apiCall.showToast("Can't process with empty Header", 'Error', 'errorToastr')
    }
  }

  onPreview(){
    this.contentForm.value.content = this.container
    if(this.contentForm.value.content !== ''){
      console.log(this.contentForm.value)
    }
  }

  onRemove(index){
    if(index != -1){
      this.container.splice(index,1)
    }
  }

  previewOpen(param: any){
    this.modalService.open(param, { centered: true, backdrop: true, size: 'xl' });
  }

}
