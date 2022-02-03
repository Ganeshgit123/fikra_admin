import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-trust-tab-section',
  templateUrl: './trust-tab-section.component.html',
  styleUrls: ['./trust-tab-section.component.scss']
})
export class TrustTabSectionComponent implements OnInit {
  public Editor = DecoupledEditor;
  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
  updatedby: any;
  role: any;
  trustMiddleContent: FormGroup;
  addTabContentForm: FormGroup;
  imagePreview = null;
  fileUpload: any;
  imgUrl: any;
  showAccept = true;
  page = 1;
  total: any;
  trustAccordianData = [];
  isEdit = false;
  tabId: any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');


    this.trustMiddleContent = this.formBuilder.group({
      header: [''],
      description: [''],
      header_Ar: [''],
      description_Ar: [''],
    });

    this.addTabContentForm = this.formBuilder.group({
      Header: [''],
      Description: [''],
      Header_Ar: [''],
      Description_Ar: [''],
      downloadLink: [''],
    });

    this.fetchTabContentData();

    this.fetchMiddleData();
    this.callRolePermission();
  }

  callRolePermission() {
    if (sessionStorage.getItem('adminRole') !== 's_a_r') {
      let contentPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = contentPermssion[3].write
      // console.log("prer", contentPermssion[3])
    }
  }

  fetchMiddleData() {
    let params = {
      url: "admin/getTrustSaftyContent",
    }
    this.apiCall.commonGetService(params).subscribe((result: any) => {
      let resu = result.body;
      if (resu.error == false) {
        this.trustMiddleContent = this.formBuilder.group({
          header: [resu.data.accDescription[0].header, []],
          description: [resu.data.accDescription[0].description, []],
          header_Ar: [resu.data.accDescription[0].header_Ar, []],
          description_Ar: [resu.data.accDescription[0].description_Ar, []],
        });

      } else {
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    }, (error) => {
      console.error(error);

    });
  }

  onSubmit() {
    const postData = this.trustMiddleContent.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/postTrustAndSaftyAccDescription',
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

  fetchTabContentData() {
    let params = {
      url: "admin/getTrustSaftyContent",
    }
    this.apiCall.commonGetService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {

          this.trustAccordianData = response.body.data.accordian;
          this.total = this.trustAccordianData.length;
          // console.log("dd",this.journeyBoxData)
        } else {
          this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
        }
      }, (error) => {
        console.error(error);

      });
  }


  uploadImageFile(event) {
    const file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
    this.fileUpload = file
    // console.log(this.fileUpload)
  }

  addTabSectionContent(tabContentSection: any) {
    this.addTabContentForm.reset();
    this.isEdit = false;
    this.imagePreview = null;
    this.fileUpload = null;
    this.modalService.open(tabContentSection, { centered: true, size: 'xl' });
  }

  removeImg() {
    this.imagePreview = null;
    this.fileUpload = null;
  }

  viewTabAccordianData(data, tabContentSection: any) {
    // console.log(data)
    this.modalService.open(tabContentSection, { centered: true, size: 'xl' });
    this.isEdit = true;
    this.imagePreview = data['downloadLink'];
    this.tabId = data['_id'];

    this.addTabContentForm = this.formBuilder.group({
      Header: [data['Header']],
      Header_Ar: [data['Header_Ar']],
      Description: [data['Description']],
      Description_Ar: [data['Description_Ar']],
      downloadLink: [data['downloadLink']],
    })
  }

  onTabSectionSubmit() {
    if (this.isEdit) {
      this.tabEditService(this.addTabContentForm.value)
      return;
    }
    if (this.fileUpload) {
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

            const postData = this.addTabContentForm.value;
            postData['downloadLink'] = this.imgUrl;
            postData['createdBy'] = this.updatedby;
            postData['userType'] = "admin";
            postData['role'] = this.role;

            var params1 = {
              url: 'admin/postAccordianSection_Trust',
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
    } else {
      const postData = this.addTabContentForm.value;
      postData['downloadLink'] = this.imagePreview;
      postData['createdBy'] = this.updatedby;
      postData['userType'] = "admin";
      postData['role'] = this.role;

      var params1 = {
        url: 'admin/postAccordianSection_Trust',
        data: postData
      }
      // console.log("add",params1)
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

  tabEditService(data) {
    if (this.fileUpload) {
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
            const data = this.addTabContentForm.value;
            data['downloadLink'] = this.imgUrl;
            data['accId'] = this.tabId;
            data['createdBy'] = this.updatedby;
            data['userType'] = "admin";
            data['role'] = this.role;

            var params1 = {
              url: 'admin/editAccordianSection_Trust',
              data: data
            }
            this.apiCall.commonPostService(params1).subscribe(
              (response: any) => {
                if (response.body.error == false) {

                  this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
                  this.imagePreview = null;
                  this.isEdit = false;
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
    } else {
      const data = this.addTabContentForm.value;
      data['downloadLink'] = this.imagePreview;
      data['accId'] = this.tabId;
      data['createdBy'] = this.updatedby;
      data['userType'] = "admin";
      data['role'] = this.role;

      var params1 = {
        url: 'admin/editAccordianSection_Trust',
        data: data
      }
      this.apiCall.commonPostService(params1).subscribe(
        (response: any) => {
          if (response.body.error == false) {

            this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
            this.imagePreview = null;
            this.isEdit = false;
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

  onDeletetab(id) {
    const object = {}

    object['accId'] = id;
    object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

    var params = {
      url: 'admin/removeAccordianSection_Trust',
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
