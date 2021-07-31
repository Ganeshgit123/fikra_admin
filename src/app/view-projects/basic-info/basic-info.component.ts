import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {
  projectId:any;
  projectList: any=[];
  basicInfoObject:any;

  basicInfoArray =[];

 constructor(private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.projectId = params.id);

    this._fetchBasicInfo();
  }

  _fetchBasicInfo(){
    let params = {
      url: "admin/getProjectListById",
      projectId : this.projectId
    }  
    this.apiCall.projectGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
         this.projectList = resu.data;
         this.projectList.forEach(element => {
          this.basicInfoObject = element.basicInfoId
               
          });
          this.basicInfoArray.push(this.basicInfoObject)

  // console.log("llll", this.basicInfoArray)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

}
