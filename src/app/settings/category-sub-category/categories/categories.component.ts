import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  addNewCategory:FormGroup;
  updatedby:any;
  role:any;
  categList =[];
  isEdit = false;
  cateId:any;
  showAccept = true;

  constructor(private formBuilder: FormBuilder,
    private apiCall: ApiCallService,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    this.addNewCategory = this.formBuilder.group({
      categorieName: [''],
      discription: [''],
    });

    this.fetchCategoryList();
    this.callRolePermission();

  }

  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = settingPermssion[4].write
      // console.log("prer", settingPermssion[4])
    }
  }
  
  fetchCategoryList(){
    let params = {
      url: "admin/getallCategories",
    }  
    this.apiCall.smallGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.categList = resu.list;
        // console.log("ef",this.categList)

      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    });
  }

  addCategory(centerDataModal: any){
    this.modalService.open(centerDataModal, { centered: true });
  }
  
  addCategorySubmit(){

    if(this.isEdit){
      this.categoryEditService(this.addNewCategory.value)
      return;
    }
    
        const postData = this.addNewCategory.value;
        postData['createdby'] = this.updatedby;
        postData['userType'] = "admin";
        postData['role'] = this.role;
    
        var params = {
          url: 'admin/createCategories',
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
    
      viewCategory(data,centerDataModal: any){
        this.modalService.open(centerDataModal, { centered: true });
        this.isEdit = true;
        this.cateId = data['_id'];
        this.addNewCategory   = this.formBuilder.group({
          categorieName: [data['categorieName']],
          discription: [data['discription']],
        })
      }
    
      categoryEditService(data){
    
        data['_id'] = this.cateId
        data['updatedby'] = this.updatedby;
        data['userType'] = "admin";
        data['role'] = this.role;
        data['processName'] = "edit";
    
        var params = {
          url: 'admin/updateCategorie',
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
    
      deleteCateg(id){
    
        const data = {}
    
        data['_id'] = id
        data['updatedby'] = this.updatedby;
        data['userType'] = "admin";
        data['role'] = this.role;
        data['processName'] = "delete";
    
        var params = {
          url: 'admin/updateCategorie',
          data: data
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

      onchangeCategStatus(values:any,id){

        if(values.currentTarget.checked === true){
          var visible = true 
         } else {
           var visible = false
         }

        //  console.log("boole",visible)
         const object = {}
    
         object['_id'] = id;
         object['processName'] = "edit";
         object['_isOn_'] = visible;
         object['updatedby'] = this.updatedby;
        object['userType'] = "admin";
        object['role'] = this.role;
    
         var params = {
          url: 'admin/updateCategorie',
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

}
