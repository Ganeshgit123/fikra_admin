import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $:any;

@Component({
  selector: 'app-creators-corner',
  templateUrl: './creators-corner.component.html',
  styleUrls: ['./creators-corner.component.scss']
})
export class CreatorsCornerComponent implements OnInit {
  updatedby:any;
  role:any;
  addCreatorData: FormGroup;
  imagePreview = null;
  fileUpload: any;
  creatorData : any =[];

 constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addCreatorData = this.formBuilder.group({
      creatorImg: [''],
      creatHead: [''],
      creatDesc: [''],
      creatLink: [''],
    });

    this.fetchCratorsData();

  }
  
  fetchCratorsData(){
    let params = {
      url: "admin/getHomeCreatorCorner",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.creatorData = resu.data;
// console.log("dd",this.creatorData)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  uploadImageFile(event){
    var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = event.target.files[0]
  }




  addCreators(creatorCorner: any){
    this.modalService.open(creatorCorner, { centered: true });

  }


  onSubmit(){

  }

}
