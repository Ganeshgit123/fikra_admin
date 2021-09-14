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
  isEdit = false;
  creatorId:any


 constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addCreatorData = this.formBuilder.group({
      blogImage: [''],
      headName: [''],
      headName_ar: [''],
      discription: [''],
      discription_ar: [''],
      blogLink: [''],
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
    this.modalService.open(creatorCorner, { centered: true });

  }


  onSubmit(){

    if(this.isEdit){
      this.creatorEditService(this.addCreatorData.value)
      return;
    }

    var postData = new FormData();
    postData.append('headName', this.addCreatorData.get('headName').value);
    postData.append('headName_ar', this.addCreatorData.get('headName_ar').value);
    postData.append('discription', this.addCreatorData.get('discription').value);
    postData.append('discription_ar', this.addCreatorData.get('discription_ar').value);
    postData.append('blogLink', this.addCreatorData.get('blogLink').value);
    postData.append('blogImage', this.fileUpload);
    postData.append('createdBy', this.updatedby);
    postData.append('userType', 'admin');
    postData.append('role', this.role);

    var params = {
      url: 'admin/postCreatorContent',
      data: postData
    }
    // console.log("img",params)

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

    viewCreatorContent(data,creatorCorner: any){
      this.modalService.open(creatorCorner, { centered: true });
      this.isEdit = true;
      this.imagePreview = data['blogImage'];
      this.creatorId = data['_id'];
  
      this.addCreatorData   = this.formBuilder.group({
        blogImage: [''],
        headName: [data['headName']],
        headName_ar: [data['headName_ar']],
        discription: [data['discription']],
        discription_ar: [data['discription_ar']],
        blogLink: [data['blogLink']],
      })
  
    }

    creatorEditService(data){
      if(this.fileUpload){
      var data:any = new FormData();
        data.append('headName', this.addCreatorData.get('headName').value);
        data.append('headName_ar', this.addCreatorData.get('headName_ar').value);
        data.append('discription', this.addCreatorData.get('discription').value);
        data.append('discription_ar', this.addCreatorData.get('discription_ar').value);
        data.append('blogLink', this.addCreatorData.get('blogLink').value);
        data.append('blogImage', this.fileUpload);
        data.append('createdBy', this.updatedby);
        data.append('userType', 'admin');
        data.append('role', this.role);
        data.append('blogId', this.creatorId);

    }else{

    const data = this.addCreatorData.value;
    data['blogImage'] = this.imagePreview;
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['blogId'] = this.creatorId;
  }

  var params = {
    url: 'admin/updateCreatorContent',
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

    onchangeBlogStatus(values:any,id){
      if(values.currentTarget.checked === true){
        var visible = true 
       } else {
         var visible = false
       }
       const object = {}
  
       object['_isVisible_'] = visible;
       object['_isDeleted_'] = false;
       object['blogId'] = id;
       object['createdBy'] = this.updatedby;
      object['userType'] = "admin";
      object['role'] = this.role;
  
       var params = {
        url: 'admin/updateCreatorContent',
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

}
