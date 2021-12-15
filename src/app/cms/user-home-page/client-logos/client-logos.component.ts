import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
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
  imgUrl:any;
  page = 1;
  total: any;

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
          headName: [resu.data.creative[0].headName,[]],
          headName_ar: [resu.data.creative[0].headName_ar,[]],
          discription: [resu.data.creative[0].discription,[]],
          discription_ar: [resu.data.creative[0].discription_ar,[]],
        });

        this.clientData = resu.data.creative[0].clientLogo;
        this.total = this.clientData.length


      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  uploadImageFile(event){
    const file = event.target.files && event.target.files[0];
    var valid = this.checkFileFormat(event.target.files[0]);
    if(!valid) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = file
      // console.log(this.filesToUpload)
    } else {
      // Not valild image
    }
  }



  checkFileFormat(checkFile){
    if(checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'image/jpg' || checkFile.type == 'image/TIF' || checkFile.type == 'image/tif' || checkFile.type == 'image/tiff'){
      return false;
    } else {
      return true;
    }
  }



  addCreators(creatorCorner: any){
    this.addClientLogo.reset();
    this.imagePreview = null;
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
        // console.log("res",response)

        if (response.body.error == false) {
     
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.modalService.dismissAll();
          this.imagePreview = null;
          this.addClientLogo.reset();
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
    if(this.fileUpload){
      var postData = new FormData();
  
      postData.append('imageToStore', this.fileUpload);
  
      var params = {
        url: 'admin/postImagetoS3',
        data: postData
      }
  
      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
  
          if (response.body.error == false) {
                this.imgUrl = response.body.data.Location
                    data['clientLogo'] = this.imgUrl;
            
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

    // console.log("lol",this.imgUrl)
    data['clientLogo'] = this.imagePreview;
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['clientLogoId'] = this.logoId;
  
  var params1 = {
  url: 'admin/updateClientLogo',
  data: data
  }
  // console.log("img",params1)
  this.apiCall.commonPutService(params1).subscribe(
  (response: any) => {
  if (response.body.error == false) {
  
  this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
  this.modalService.dismissAll();
  this.imagePreview = null;
  this.addClientLogo.reset();
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

  onchangeLogoStatus(values:any,id){
    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }
     const object = {}

     object['_isLogoOn_'] = visible;
     object['_isDeleted_'] = false;
     object['clientLogoId'] = id;
     object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/updateClientLogoStatus',
      data: object
    }
    this.apiCall.commonPutService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast("Changed Successfully", 'Success', 'successToastr')
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

  onDeleteClientLogo(val,id,visible){
    const object = {}
  
    object['clientLogoId'] = id;
    object['_isLogoOn_'] = visible;
    object['_isDeleted_'] = val;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/updateClientLogoStatus',
     data: object
   }
  //  console.log("da",params)
   this.apiCall.commonPutService(params).subscribe(
     (response: any) => {
       if (response.body.error == false) {
         // Success
         this.apiCall.showToast("Deleted Successfully", 'Success', 'successToastr')
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

}
