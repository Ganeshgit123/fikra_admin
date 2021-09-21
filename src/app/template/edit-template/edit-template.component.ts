import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder,FormArray,FormControl  } from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss']
})
export class EditTemplateComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  isEdit =false;
  templateId:any;
  contentForm: FormGroup;
  projectDetails = [];

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Template Edit Page' },{ label: 'Edit Template', active: true }];

    this.getProjectInfo();

    this.apiCall.templateEditFn.subscribe(result => {
      if(result != '0'){
        if(result['isEdit'] === true){
          this.isEdit = true;
          this.editTemplates(result)
        } else {
          this.isEdit = false;
          this.contentForm.reset();
        }
        
        }
      }, err => {
      console.log(err);
    });

  }


  getProjectInfo() {
    let params = {
      url: "admin/listProject",
    }
    this.apiCall.smallGetService(params).subscribe((result: any) => {
      let resu = result.body;
      if (resu.error == false) {
        this.projectDetails = resu.data
        // console.log("list",this.projectDetails)
      }
    }, (error) => {
      console.error(error);

    });
  }


  public editTemplates(data){
    console.log("edit",data)

    this.templateId = data['_id'] 

    var contentValue = data['content']
    var contentArray = []

    if(contentValue.length > 0){
      for(var i=0; i < contentValue.length; i++){
        contentArray.push(this.contentEditArray(contentValue[i]))
      }
    }


    this.contentForm = this.formBuilder.group({
      templateName: [data['templateName']],
      content: this.formBuilder.array(contentArray),
    });

  }

  contentEditArray(obj): FormGroup{
    console.log("droparray",obj)
    return this.formBuilder.group({
      textHead: [obj.textHead],
      textContent:[obj.textContent],
      project_One: [obj.project_One],
      project_Two: [obj.project_Two],
      project_Three: [obj.project_Three],
      learnMore_URL: [obj.learnMore_URL],
    })
  }

  addContent(){
    let control = <FormArray>this.contentForm.controls.content;
    control.push(
      this.formBuilder.group({
        textHead: [''],
      textContent:[''],
      project_One: [''],
      project_Two: [''],
      project_Three: [''],
      learnMore_URL: [''],
      })
    )
  }

  deleteOptions(index){
    let control = <FormArray>this.contentForm.controls.content;
    control.removeAt(index)
  }

  onSubmitContent(){
    // if(this.isEdit){
    //   this.fieldEditService(this.empForm.value)
    //   return;
    // }

  }

}
