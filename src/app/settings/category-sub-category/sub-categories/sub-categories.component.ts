import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss']
})
export class SubCategoriesComponent implements OnInit {
  addNewSubCategory:FormGroup;
  updatedby:any;
  role:any;
  isEdit = false;
  categList=[];
  subCateg=[];
  subCateId:any;
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

 
    this.addNewSubCategory = this.formBuilder.group({
      categorieId: [''],
      subCategorieName: [''],
      subCategorieNameAr: [''],
      discription: [''],
      discriptionAr: [''],
    });

    this.fetchcategList();
    this.fetchSubCategData();
    this.callRolePermission();

  }
  callRolePermission(){
    if(sessionStorage.getItem('adminRole') !== 's_a_r'){
      let settingPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = settingPermssion[4].write
      // console.log("prer", settingPermssion[4])
    }
  }

  fetchcategList(){
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

  fetchSubCategData(){
    let params = {
      url: "admin/getAllSubCategoriy",
    }  
    this.apiCall.smallGetService(params).subscribe((result:any)=>{
      let resu = result.body;
      if(resu.error == false)
      {
        this.subCateg = resu.list;
      this.total = this.subCateg.length

        // console.log("res",this.total)
      }else{
        this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
      }
    },(error)=>{
       console.error(error);
       
    }); 

  }

  addSubCategory(subCategoryModal: any){
    this.modalService.open(subCategoryModal, { centered: true });
  }

  viewSubCategory(data,subCategoryModal: any){
    this.modalService.open(subCategoryModal, { centered: true });
    this.isEdit = true;
    this.subCateId = data['_id'];
    this.addNewSubCategory   = this.formBuilder.group({
      categorieId: [data['categorieId']],
      subCategorieName: [data['subCategorieName']],
      subCategorieNameAr: [data['subCategorieNameAr']],
      discription: [data['discription']],
      discriptionAr: [data['discriptionAr']],
    })
  }

  SubcategoryEditService(data){
    
    data['_id'] = this.subCateId
    data['updatedby'] = this.updatedby;
    data['userType'] = "admin";
    data['role'] = this.role;
    data['processName'] = "edit";

    var params = {
      url: 'admin/updateSubCategoriy',
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


  onSubmit(){

    if(this.isEdit){
      this.SubcategoryEditService(this.addNewSubCategory.value)
      return;
    }

    const postData = this.addNewSubCategory.value;
    postData['createdby'] = this.updatedby;
    postData['userType'] = "admin";
    postData['role'] = this.role;

    var params = {
      url: 'admin/addSubCategoriy',
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

  deleteSubCateg(id){
    const data = {}
    
        data['_id'] = id
        data['updatedby'] = this.updatedby;
        data['userType'] = "admin";
        data['role'] = this.role;
        data['processName'] = "delete";
    
        var params = {
          url: 'admin/updateSubCategoriy',
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

  onchangeSubCategStatus(values:any,id){

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
      url: 'admin/updateSubCategoriy',
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
