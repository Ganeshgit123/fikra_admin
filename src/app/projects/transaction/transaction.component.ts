import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiCallService } from "../../services/api-call.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-transaction",
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.scss"],
})
export class TransactionComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  accToken = sessionStorage.getItem("access_token");

  updatedby = sessionStorage.getItem("adminId");
  role = sessionStorage.getItem("adminRole");
  transHistory = [];
  payableAmount: any;
  modelName: any;
  addTransData = {
    description:'',
    payedAmount: null,
    balancePayable: null,
    payableAmount: null,
    totalPaid: null
  };
  isEditTrans: any;
  transId: any;
  projectId: any;
  fileUpload: any;
  docUrl: any;
  showAccept: boolean;
  approveAccept: boolean;
  majorWrite: boolean;
  requestWrite: boolean;
  permName: any;
  isTimeBasedWirte: boolean;
  canWrite: boolean;

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: "Transactions List", active: true }];
    this.route.params.subscribe((params) => (this.projectId = params.id));

    this.fetchTransaction();
    this.callRolePermission();
  }
  callRolePermission() {
    if (sessionStorage.getItem('adminRole') == 's_a_r') {
      this.majorWrite = true;
    }
    if (sessionStorage.getItem('adminRole') !== 's_a_r') {
      let creatorPermssion = JSON.parse(sessionStorage.getItem('permission'))
      this.showAccept = creatorPermssion[0].write
      this.approveAccept = creatorPermssion[0]._with_Approval_
      this.permName = creatorPermssion[0].permissionName
      this.isTimeBasedWirte = JSON.parse(sessionStorage.getItem('isTimeBasedWirte'));
      this.canWrite = JSON.parse(sessionStorage.getItem('canWrite'));

      if (this.showAccept == true) {
        if (this.approveAccept == false && this.isTimeBasedWirte == false) {
          this.majorWrite = true;
          console.log("first_condition")
        } else if (this.isTimeBasedWirte === true && this.canWrite === true) {
          this.majorWrite = true;
          console.log("second_condition")
        } else if (this.approveAccept == true) {
          this.requestWrite = true;
          console.log("request_condition")
        } else {
          this.majorWrite = false;
          console.log("1st_else_condition")
        }
      } else {
        this.majorWrite = false;
        console.log("2nd_else_condition")
      }


    }
  }
  
  fetchTransaction() {
    let params = {
      url: "admin/getTransactionAdmin",
      projectId: this.projectId,
    };
    this.apiCall.projectLikedGetService(params).subscribe(
      (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          this.payableAmount = resu.data.payableAmount;
          this.modelName = resu.data.modelName;
          this.transHistory = resu.data.transactionHistory;
        } else {
          this.apiCall.showToast(resu.message, "Error", "errorToastr");
          // this.router.navigateByUrl('/projects');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  addTrans(transData: any) {
    this.modalService.open(transData, { centered: true });
  }

  uploadImageFile(event) {
    const file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.onload = (event: any) => {};
    reader.readAsDataURL(event.target.files[0]);
    this.fileUpload = file;
  }

  onTransSubmit() {
    if (this.isEditTrans) {
      this.transEditService(this.addTransData);
      return;
    }
    if (this.requestWrite !== true) {
    var postData = new FormData();

    postData.append("imageToStore", this.fileUpload);

    var params = {
      url: "admin/postImagetoS3",
      data: postData,
    };
    this.spinner.show();

    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.docUrl = response.body.data.Location;

          const postData = this.addTransData;

          postData["document"] = this.docUrl;
          postData["projectId"] = this.projectId;
          postData["createdBy"] = this.updatedby;
          postData["userType"] = "admin";
          postData["role"] = this.role;
          postData["payableAmount"] = this.addTransData['balancePayable'];
          var params1 = {
            url: "admin/addTransactionAdmin",
            data: postData,
          };

          this.apiCall.commonPostService(params1).subscribe((response: any) => {
            if (response.body.error == false) {
              this.apiCall.showToast(
                response.body.message,
                "Success",
                "successToastr"
              );
              this.ngOnInit();
              this.modalService.dismissAll();
              this.spinner.hide();
            } else {
              this.apiCall.showToast(
                response.body.message,
                "Error",
                "errorToastr"
              );
              this.spinner.hide();
            }
          });

          this.addTransData = {
            description:'',
            payedAmount: null,
            balancePayable: null,
            payableAmount: null,
            totalPaid: null
          }
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, "Error", "errorToastr");
          this.spinner.hide();
        }
      },
      (error) => {
        this.apiCall.showToast("Server Error !!", "Oops", "errorToastr");
        this.spinner.hide();
        console.log("Error", error);
      }
    );
    }else if(this.requestWrite == true){
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
            this.docUrl = response.body.data.Location

            const postData = {};
            postData['createdBy'] = this.updatedby;
            postData['userType'] = "admin";
            postData['role'] = this.role;
            postData['tabName'] = "Transactions";
            postData['feildName'] = "New Transaction";
            postData['valueFrom'] = "";
            postData['valueTo'] = "";
            postData['APIURL'] = "https://fikra.app/api/admin/addTransactionAdmin";
            postData['paramsForAPI'] = {
              ...this.addTransData,
              ['document']: this.docUrl,
              ['projectId']: this.projectId,
              ['payableAmount']: this.addTransData['balancePayable'],
            }

            var params1 = {
              url: 'admin/requsetToSuperAdminForChange',
              data: postData
            }
            //  console.log("pa",params1)
            this.apiCall.commonPostService(params1).subscribe(
              (response: any) => {
                if (response.body.error == false) {
                  // Success
                  this.apiCall.showToast("Request Sent Successfully", 'Success', 'successToastr')
                  this.ngOnInit();
          this.modalService.dismissAll();
          this.spinner.hide();
                } else {
                  // Query Error
                  this.apiCall.showToast(response.body.message, 'Error', 'errorToastr')
                  this.spinner.hide();
                }
              },
              (error) => {
                this.apiCall.showToast('Server Error !!', 'Oops', 'errorToastr')
                console.log('Error', error)
              }
            )
          }
        }
      )
    }
  }

  editTrans(data, transData: any) {

    this.isEditTrans = true;

    this.transId = data["_id"];

    this.addTransData = {
      description: data["description"],
      payedAmount: data["payedAmount"],
      balancePayable: data["balancePayable"],
      payableAmount: data["payableAmount"],
      totalPaid: data["totalPaid"]
    }

    this.modalService.open(transData, { centered: true });

  }

  transEditService(data) {
    data["projectId"] = this.projectId;
    data["transactionId"] = this.transId;
    data["createdBy"] = this.updatedby;
    data["userType"] = "admin";
    data["role"] = this.role;

    var params = {
      url: "admin/editTransactionAdmin",
      data: data,
    };
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          // Success
          this.apiCall.showToast(
            response.body.message,
            "Success",
            "successToastr"
          );
          this.isEditTrans = false;
          this.modalService.dismissAll();
          this.ngOnInit();
        } else {
          // Query Error
          this.apiCall.showToast(response.body.message, "Error", "errorToastr");
        }
      },
      (error) => {
        this.apiCall.showToast("Server Error !!", "Oops", "errorToastr");
        console.log("Error", error);
      }
    );
  }

  // onDeleteTrans(id) {
  //   const object = {};

  //   object["transactionId"] = id;
  //   object["projectId"] = this.projectId;
  //   object["createdBy"] = this.updatedby;
  //   object["userType"] = "admin";
  //   object["role"] = this.role;

  //   var params = {
  //     url: "admin/deleteTransactionAdmin",
  //     data: object,
  //   };
    
  //   this.apiCall.commonPostService(params).subscribe(
  //     (response: any) => {
  //       if (response.body.error == false) {
  //         // Success
  //         this.apiCall.showToast(
  //           "Deleted Successfully",
  //           "Success",
  //           "successToastr"
  //         );
  //         this.ngOnInit();
  //         this.modalService.dismissAll();
  //       } else {
  //         // Query Error
  //         this.apiCall.showToast(response.body.message, "Error", "errorToastr");
  //       }
  //     },
  //     (error) => {
  //       this.apiCall.showToast("Server Error !!", "Oops", "errorToastr");
  //       console.log("Error", error);
  //     }
  //   );
  // }

  async onChangeValue(element){
    let Id = element.target.id;
    this.addTransData[Id] = element.target.value;
    if(Id == 'payedAmount'){
      if(this.addTransData[Id] <= this.payableAmount){
        let returned = null;

        await this.transHistory.reduce(
          async (promise, elementss) => {
            returned += parseInt(elementss.payedAmount)
            await promise;
          }, Promise.resolve()
        )
  
        this.addTransData['balancePayable'] = this.payableAmount - this.addTransData[Id]
        this.addTransData['totalPaid'] = returned ? parseInt(returned) + parseInt(this.addTransData[Id]) : this.addTransData[Id]
      }else{
        this.apiCall.showToast("Please enter the amount below payable amount", "Oops", "errorToastr");
      }
      
    }
  }
  
  closeModel(){
    this.addTransData = {
      description:'',
      payedAmount: null,
      balancePayable: null,
      payableAmount: null,
      totalPaid: null
    }
    this.modalService.dismissAll('Cross click')
  }
}
