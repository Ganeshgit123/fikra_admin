import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $:any;


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  updatedby:any;
  role:any;
  bannerLeftCont: FormGroup;
  addBannerImg: FormGroup;
  imagePreview = null;
  fileUpload: any;

  bannerImage: any =[];
 
  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {

    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.bannerLeftCont = this.formBuilder.group({
      bannerLeftContents: [''],
      bannerLeftContents_ar: [''],
      companyName: [''],
      companyName_ar: [''],
      headName: [''],
      headName_ar: [''],
      buttonName: [''],
      buttonName_ar: [''],
      buttonURL: [''],
    });

    this.addBannerImg = this.formBuilder.group({
      bannerImage: [''],
      imageAlt: [''],
    });

    this.fetchHomePageLeftData();

  }

  fetchHomePageLeftData(){
    let params = {
      url: "admin/getHomeHeaderContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {

        this.bannerLeftCont = this.formBuilder.group({
          bannerLeftContents: [resu.data.bannerLeftContents,[]],
          bannerLeftContents_ar: [resu.data.bannerLeftContents_ar,[]],
          companyName: [resu.data.companyName,[]],
          companyName_ar: [resu.data.companyName_ar,[]],
          headName: [resu.data.headName,[]],
          headName_ar: [resu.data.headName_ar,[]],
          buttonName: [resu.data.buttonName,[]],
          buttonName_ar: [resu.data.buttonName_ar,[]],
          buttonURL: [resu.data.buttonURL,[]],
        });

        this.bannerImage = resu.data.bannerImage;

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  bannerCont(){

    const postData = this.bannerLeftCont.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postHomeLeftcontentandUpdate',
      data: postData
    }
console.log("ddd",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          // console.log("res",response.body)

          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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

  uploadImageFile(event){
    var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = event.target.files[0]
  }

  addBannner(centerDataModal: any){
    this.modalService.open(centerDataModal, { centered: true });

  }

 bannerImgUpload(){
console.log("fewfe")

    var postData = new FormData();
    postData.append('bannerImage', this.fileUpload);
    postData.append('createdBy', this.updatedby);
    postData.append('userType', 'admin');
    postData.append('role', this.role);

    var params = {
      url: 'admin/postBannerImage',
      data: postData
    }
    console.log("img",params)

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        console.log("res",response)

        if (response.body.error == false) {
     
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
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
