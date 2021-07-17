import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $:any;

@Component({
  selector: 'app-client-logos',
  templateUrl: './client-logos.component.html',
  styleUrls: ['./client-logos.component.scss']
})
export class ClientLogosComponent implements OnInit {
  updatedby:any;
  role:any;
  addClientLogo: FormGroup;
  imagePreview = null;
  fileUpload: any;
  clientData:any = [];

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');


    this.addClientLogo = this.formBuilder.group({
      logoName: [''],
      clientLogo: [''],
      logoAlt: [''],
    });

    this.fetchclientData();
  }

  fetchclientData(){
    let params = {
      url: "admin/getHomeClientCorner",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.clientData = resu.data.clientLogo;

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

    var postData = new FormData();

    postData.append('logoName', this.addClientLogo.get('logoName').value);
    postData.append('logoAlt', this.addClientLogo.get('logoAlt').value);
    postData.append('clientLogo', this.fileUpload);
    postData.append('createdBy', this.updatedby);
    postData.append('userType', 'admin');
    postData.append('role', this.role);

    var params = {
      url: 'admin/postclientLogo',
      data: postData
    }
  
     console.log("img",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        console.log("res",response)

        if (response.body.error == false) {
     
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.modalService.dismissAll();
          this.imagePreview = null;
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

  ngOnDestroy() {
    this.imagePreview = null;
    this.addClientLogo.reset();
    this.modalService.dismissAll();
  }

}
