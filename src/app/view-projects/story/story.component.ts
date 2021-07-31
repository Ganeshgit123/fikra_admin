import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../../services/api-call.service';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  projectId:any;
  projectList: any=[];
  storyObject:any;

  storyArray =[];

  constructor(private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.projectId = params.id);

    this._fetchStory();
  }

  _fetchStory(){
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
          this.storyObject = element.storyTableId
               
          });
          this.storyArray.push(this.storyObject)

  // console.log("llll", this.storyArray)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }
  
}

