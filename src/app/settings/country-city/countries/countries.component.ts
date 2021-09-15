import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {
  addNewCountry:FormGroup;
  updatedby:any;
  role:any;
  isEdit = false;
  countryList=[];
  countryId:any;
  showAccept = true;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');
    this.addNewCountry = this.formBuilder.group({
      countryName: [''],
      countryNameAr: [''],
      countryCode: [''],
    });

    this.fetchCountryList();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = settingPermssion[4].write
      // console.log("prer", settingPermssion[4])
    }
  }

  fetchCountryList(){
    let params = {
      url: "admin/getAllCountryWithCity",
    }  
    this.apiCall.smallGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.countryList = resu.data;
        // console.log("ef",this.countryList)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  addCountry(countryModal: any){
    this.modalService.open(countryModal, { centered: true });
  }

  onSubmit(){

    if(this.isEdit){
      this.countryEditService(this.addNewCountry.value)
      return;
    }

    const postData = this.addNewCountry.value;
        postData['createdby'] = this.updatedby;
        postData['userType'] = "admin";
        postData['role'] = this.role;
    
        var params = {
          url: 'admin/createCountry',
          data: postData
        }
        // console.log("data",postData)
        this.apiCall.commonPostService(params).subscribe(
          (response: any) => {
            if (response.body.error == false) {
    
              this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
              this.modalService.dismissAll();
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

  viewCountry(data,countryModal: any){
    this.modalService.open(countryModal, { centered: true });
    this.isEdit = true;
    this.countryId = data['_id'];
    this.addNewCountry   = this.formBuilder.group({
      countryName: [data['countryName']],
      countryNameAr: [data['countryNameAr']],
      countryCode: [data['countryCode']],
    })
  }

  countryEditService(data){
    data['countryId'] = this.countryId;
    data['createdby'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;

    var params = {
      url: 'admin/updateCountryById',
      data: data
    }

    // console.log("par",params)
    this.apiCall.commonPutService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(response.body.message, 'Success', 'successToastr')
          this.isEdit = false;
          this.modalService.dismissAll();
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

  onchangecountryStatus(values:any,id){

    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }

    //  console.log("boole",visible)
     const object = {}

     object['countryId'] = id;
     object['_isOn_'] = visible;
     object['_isDeleted_'] = false;
     object['createdby'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;

     var params = {
      url: 'admin/updateCountryStatus',
      data: object
    }
    // console.log("fef",params)
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

  deleteCountry(id,val){
    
    const object = {}

   
    object['countryId'] = id;
    object['_isOn_'] = val;
    object['_isDeleted_'] = true;
    object['createdby'] = this.updatedby;
   object['userType'] = "admin";
   object['role'] = this.role;

    var params = {
     url: 'admin/updateCountryStatus',
     data: object
   }

    // console.log("par",params)
    this.apiCall.commonPutService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast('Deleted Successfully', 'Success', 'successToastr')
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
