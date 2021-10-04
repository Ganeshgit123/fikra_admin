import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  addNewCity:FormGroup;
  updatedby:any;
  role:any;
  isEdit = false;
  countryList=[];
  cityId:any;
  contrid:any;
  showAccept = true;
  searchTerm;
  page = 1;
  total: any;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addNewCity = this.formBuilder.group({
      countryId: [''],
      cityName: [''],
      cityNameAr: [''],
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

        this.countryList .forEach(element => {
         var cityLen = element.city
          this.total = cityLen.length
        });
        console.log(this.total)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  

  addCity(cityModal: any){
    this.modalService.open(cityModal, { centered: true });
  }


  onCitySubmit(){

    if(this.isEdit){
      this.cityEditService(this.addNewCity.value)
      return;
    }

    const postData = this.addNewCity.value;
    postData['createdBy'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/addCity',
      data: postData
    }
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

  viewCity(id,data,cityModal: any){
    this.modalService.open(cityModal, { centered: true });
    this.isEdit = true;
    this.contrid = id;
    this.cityId = data['_id'];
    this.addNewCity   = this.formBuilder.group({
      countryId: [this.contrid],
      cityName: [data['cityName']],
      cityNameAr: [data['cityNameAr']],
    })
  }

  cityEditService(data){
    data['cityId'] = this.cityId
    data['createdBy'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['_isDeleted_'] = false;
    data['_isOn_'] = true;

    var params = {
      url: 'admin/updateCityCountryId',
      data: data
    }
    // console.log("data",params)

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

  onchangeCityStatus(values:any,id,data){
    if(values.currentTarget.checked === true){
      var visible = true 
     } else {
       var visible = false
     }

     var object = {}

     object['cityId'] = data['_id']
     object['countryId'] = id
     object['cityName'] = data['cityName']
     object['cityNameAr'] = data['cityNameAr']
     object['createdBy'] = this.updatedby;
     object['userType'] = "admin";
     object['role'] = this.role;
     object['_isDeleted_'] = data['_isDeleted_'];
     object['_isOn_'] = visible;

    var params = {
      url: 'admin/updateCityCountryId',
      data: object
    }
    console.log("data",params)

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

  deleteCity(id,data){
    var object = {}

    object['cityId'] = data['_id']
    object['countryId'] = id
    object['cityName'] = data['cityName']
    object['cityNameAr'] = data['cityNameAr']
    object['createdBy'] = this.updatedby;
    object['userType'] = "admin";
    object['role'] = this.role;
    object['_isDeleted_'] = true;
    object['_isOn_'] = data['_isOn_'];

   var params = {
     url: 'admin/updateCityCountryId',
     data: object
   }
  //  console.log("data",params)

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
