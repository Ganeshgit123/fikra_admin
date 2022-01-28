import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-journey-section',
  templateUrl: './journey-section.component.html',
  styleUrls: ['./journey-section.component.scss']
})
export class JourneySectionComponent implements OnInit {
  updatedby:any;
  role:any;
  journeyContent:FormGroup;
  addJourneyForm:FormGroup;
  imagePreview = null;
  fileUpload: any;
  imgUrl:any;
  showAccept = true;
  journeyBoxData = [];
  page = 1;
  total: any;
  isEdit = false;
  journeyId:any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    
    this.journeyContent = this.formBuilder.group({
      title: [''],
      title_Ar: [''],
    });

    
    this.addJourneyForm = this.formBuilder.group({
      icon: [''],
      header: [''],
      header_Ar: [''],
      containerText: [''],
      containerText_Ar: [''],
    });

    this.fetchJouneyData();
    this.fetchBoxData();
    this.callRolePermission();
  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchJouneyData(){
    let params = {
      url: "admin/getWhatWeDoContent",
    }  
    this.apiCall.commonGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.journeyContent = this.formBuilder.group({
          title: [resu.data.containerSection[0].title,[]],
          title_Ar: [resu.data.containerSection[0].title_Ar,[]],
        });

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  onSubmit(){
    const postData = this.journeyContent.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postContainerSectionTitle_WWD',
      data: postData
    }
    // console.log("data",params)
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
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

  fetchBoxData(){
    let params = {
      url: "admin/getWhatWeDoContent",
    }  
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {

        this.journeyBoxData = response.body.data.containerSection;
   // console.log("dd",this.journeyBoxData)
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
      // console.log(this.fileUpload)
    }
  }

  
  checkFileFormat(checkFile){
    if(checkFile.type == 'image/png' || checkFile.type == 'image/jpeg' || checkFile.type == 'image/jpg' || checkFile.type == 'image/TIF' || checkFile.type == 'image/tif' || checkFile.type == 'image/tiff'){
      return false;
    } else {
      return true;
    }
  }

  addJourney(creatorCorner: any){
    this.addJourneyForm.reset();
    this.imagePreview = null;
    this.modalService.open(creatorCorner, { centered: true });
  }

  viewJourneyData(data,journeySection: any){
    this.modalService.open(journeySection, { centered: true });
    this.isEdit = true;
    this.imagePreview = data['icon'];
    this.journeyId = data['_id'];
    // console.log( this.journeyId)

    this.addJourneyForm   = this.formBuilder.group({
      icon: [''],
      header: [data['header']],
      header_Ar: [data['header_Ar']],
      containerText: [data['containerText']],
      containerText_Ar: [data['containerText_Ar']],
    })
  }

  onJourneySubmit(){
    if(this.isEdit){
      this.journeyEditService(this.addJourneyForm.value)
      return;
    }
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

              const postData = this.addJourneyForm.value;
    postData['icon'] = this.imgUrl;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params1 = {
      url: 'admin/pushContainerSection_WWD',
      data: postData
    }

    this.apiCall.commonPostService(params1).subscribe(
      (response: any) => {
        if (response.body.error == false) {

          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.imagePreview = null;
          this.modalService.dismissAll();
          this.ngOnInit();
          this.spinner.hide();
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
          this.spinner.hide();
        }
      },
    )
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

  journeyEditService(data){
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
                    const data = this.addJourneyForm.value;
                    data['icon'] = this.imgUrl;
                    data['containerId'] = this.journeyId;
                    data['createdBy'] = this.updatedby;
                    data['userType'] = "admin";
                    data['role'] = this.role;
                  
                  var params1 = {
                  url: 'admin/editContainerSection_WWD',
                  data: data
                  }
                  console.log("sss",params1)
                  this.apiCall.commonPostService(params1).subscribe(
                  (response: any) => {
                  if (response.body.error == false) {
                  
                  this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
                  this.imagePreview = null;
                  this.modalService.dismissAll();
                  this.ngOnInit();
                  this.spinner.hide();
                  } else {
                  this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
                  }
                  },
                  (error) => {
                  this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
                  this.spinner.hide();
                  console.log('Error', error)
                  } 
                  )
  
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
      }else{
        const data = this.addJourneyForm.value;
        data['icon'] = this.imagePreview;
        data['containerId'] = this.journeyId;
        data['createdBy'] = this.updatedby;
        data['userType'] = "admin";
        data['role'] = this.role;
      
      var params1 = {
      url: 'admin/editContainerSection_WWD',
      data: data
      }
      console.log("ddd",params1)
      this.apiCall.commonPostService(params1).subscribe(
      (response: any) => {
      if (response.body.error == false) {
      
      this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
      this.imagePreview = null;
      this.modalService.dismissAll();
      this.ngOnInit();
      this.spinner.hide();
      } else {
      this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
      }
      },
      (error) => {
      this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
      this.spinner.hide();
      console.log('Error', error)
      } 
      )
      }
  }

  onDeleteJourney(id){
    const object = {}
  
    object['containerId'] = id;
    object['createdBy'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/removeContainerSection_WWD',
     data: object
   }
  //  console.log("da",params)
   this.apiCall.commonPostService(params).subscribe(
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
