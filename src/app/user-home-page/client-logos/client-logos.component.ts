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
  creativeIndepen: FormGroup;
  imagePreview = null;
  fileUpload: any;
  clientData:any = [];
  isEdit = false;
  logoId:any;
  logoStat:any;
  showAccept = true;

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

    this.creativeIndepen = this.formBuilder.group({
      headName: [''],
      headName_ar: [''],
      discription: [''],
      discription_ar: [''],
      buttenName: [''],
      buttenName_ar: [''],
      buttonURL: [''],
    });

    this.fetchclientData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchclientData(){
    let params = {
      url: "admin/getHomeClientCorner",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.creativeIndepen = this.formBuilder.group({
          headName: [resu.data.headName,[]],
          headName_ar: [resu.data.headName_ar,[]],
          discription: [resu.data.discription,[]],
          discription_ar: [resu.data.discription_ar,[]],
          buttenName: [resu.data.buttenName,[]],
          buttenName_ar: [resu.data.buttenName_ar,[]],
          buttonURL: [resu.data.buttonURL,[]],
        });

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

    if(this.isEdit){
      this.logoEditService(this.addClientLogo.value)
      return;
    }

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
  
    //  console.log("img",params)
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

  viewClientLogo(data,creatorCorner: any){
    this.modalService.open(creatorCorner, { centered: true });
    this.isEdit = true;
    this.imagePreview = data['logoUrl'];
    this.logoId = data['_id'];
    this.logoStat = data['_isLogoOn_'];

    this.addClientLogo   = this.formBuilder.group({
      clientLogo: [''],
      logoAlt: [data['logoAlt']],
      logoName: [data['logoName']],
    })

  }

  logoEditService(data){

    var data:any = new FormData();
    data.append('logoAlt', this.addClientLogo.get('logoAlt').value);
    data.append('logoName', this.addClientLogo.get('logoName').value);
    data.append('clientLogo', this.fileUpload);
    data.append('createdBy', this.updatedby);
    data.append('userType', 'admin');
    data.append('role', this.role);
    data.append('_isLogoOn_', true);
    data.append('clientLogoId', this.logoId);


 var params = {
   url: 'admin/updateClientLogo',
   data: data
 }
 // console.log("ppp",params)
 this.apiCall.commonPutService(params).subscribe(
   (response: any) => {
     if (response.body.error == false) {
       // Success
       this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
       this.isEdit = false;
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

  onSubmitInde(){
    const postData = this.creativeIndepen.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postCreativeLeftContent',
      data: postData
    }
// console.log("ddd",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {

          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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

  ngOnDestroy() {
    this.imagePreview = null;
    this.addClientLogo.reset();
    this.modalService.dismissAll();
  }

}
