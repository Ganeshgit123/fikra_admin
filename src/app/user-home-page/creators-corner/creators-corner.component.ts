import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
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
  createCornerData : any;
  showAccept = true;

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
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }
  
  fetchCratorsData(){
    let params = {
      url: "admin/getHomeCreatorCorner",
    }  
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {

        this.createCornerData = response.body.data;
// console.log("dd",this.createCornerData)
      }else{
        this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
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
