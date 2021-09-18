import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../services/api-call.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-start-banner',
  templateUrl: './start-banner.component.html',
  styleUrls: ['./start-banner.component.scss']
})
export class StartBannerComponent implements OnInit {
  bannerLeftCont: FormGroup;
  updatedby:any;
  role:any;
  showAccept = true;
  imagePreview = null;
  imagePreview1 = null;
  imagePreview2 = null;
  fileUpload: any;
  fileUpload1: any;
  fileUpload2: any;
  imgUrl:any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.bannerLeftCont = this.formBuilder.group({
      headName: [''],
      description: [''],
      headNameAr: [''],
      descriptionAr: [''],
      buttonName: [''],
      buttonNameAr: [''],
      buttonURL: [''],
      image_One: [''],
      image_two: [''],
      image_three: [''],
    });

    this.fetchTopContent();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchTopContent(){
    let params = {
      url: "admin/get_start_project_list",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.bannerLeftCont = this.formBuilder.group({
          headName: [resu.data.topSection[0].headName,[]],
          headNameAr: [resu.data.topSection[0].headNameAr,[]],
          description: [resu.data.topSection[0].description,[]],
          descriptionAr: [resu.data.topSection[0].descriptionAr,[]],
          buttonName: [resu.data.topSection[0].buttonName,[]],
          buttonNameAr: [resu.data.topSection[0].buttonNameAr,[]],
          buttonURL: [resu.data.topSection[0].buttonURL,[]],
           image_One: [''],
      image_two: [''],
      image_three: [''],
        });

    this.imagePreview = resu.data.topSection[0].image_One;
    this.imagePreview1 = resu.data.topSection[0].image_two;
    this.imagePreview2 = resu.data.topSection[0].image_three;

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  uploadImageFile(event){
    const file = event.target.files && event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); 
      this.fileUpload = file
      // console.log(this.filesToUpload)
    }

    uploadImageFile1(event){
      const file = event.target.files && event.target.files[0];
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imagePreview1 = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]); 
        this.fileUpload1 = file
        // console.log(this.filesToUpload)
      }

      uploadImageFile2(event){
        const file = event.target.files && event.target.files[0];
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.imagePreview2 = event.target.result;
          }
          reader.readAsDataURL(event.target.files[0]); 
          this.fileUpload2 = file
          // console.log(this.filesToUpload)
        }

  bannerCont(){


    if(this.fileUpload){
      var postData = new FormData();
  
      postData.append('imageToStore', this.fileUpload);
  
      var params = {
        url: 'admin/postImagetoS3',
        data: postData
      }
      this.spinner.show();
  
      this.apiCall.commonPostService(params).subscribe(
        (response: any) => {
  
          if (response.body.error == false) {
                this.imgUrl = response.body.data.Location
                    data['image_One'] = this.imgUrl;
            
              } else {
            // Query Error
            this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
            this.spinner.hide();
          }
        },
        (error) => {
          this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
          this.spinner.hide();
          console.log('Error', error)
        } 
      )
      }

      if(this.fileUpload1){
        var postData = new FormData();
    
        postData.append('imageToStore', this.fileUpload1);
    
        var params = {
          url: 'admin/postImagetoS3',
          data: postData
        }
        this.spinner.show();
    
        this.apiCall.commonPostService(params).subscribe(
          (response: any) => {
    
            if (response.body.error == false) {
                  this.imgUrl = response.body.data.Location
                      data['image_two'] = this.imgUrl;
              
                } else {
              // Query Error
              this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
              this.spinner.hide();
            }
          },
          (error) => {
            this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
            this.spinner.hide();
            console.log('Error', error)
          } 
        )
        }

        if(this.fileUpload2){
          var postData = new FormData();
      
          postData.append('imageToStore', this.fileUpload2);
      
          var params = {
            url: 'admin/postImagetoS3',
            data: postData
          }
          this.spinner.show();
      
          this.apiCall.commonPostService(params).subscribe(
            (response: any) => {
      
              if (response.body.error == false) {
                    this.imgUrl = response.body.data.Location
                        data['image_three'] = this.imgUrl;
                
                  } else {
                // Query Error
                this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
                this.spinner.hide();
              }
            },
            (error) => {
              this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
              this.spinner.hide();
              console.log('Error', error)
            } 
          )
          }

    const data = this.bannerLeftCont.value;
    data['image_One'] = this.imagePreview;
    data['image_two'] = this.imagePreview1;
    data['image_three'] = this.imagePreview2;
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params1 = {
      url: 'admin/post_Top_startAProject',
      data: data
    }
    // console.log("data",params)
    this.apiCall.commonPostService(params1).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.imagePreview = null;
          this.ngOnInit();
          this.spinner.hide();
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
