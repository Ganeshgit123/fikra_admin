import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, FormArray, FormControl } from "@angular/forms";
import { ApiCallService } from "../../services/api-call.service";

@Component({
  selector: "app-add-new-bill",
  templateUrl: "./add-new-bill.component.html",
  styleUrls: ["./add-new-bill.component.scss"],
})
export class AddNewBillComponent implements OnInit {
  breadCrumbItems: Array<{}>;

  accToken = sessionStorage.getItem("access_token");

  updatedby = sessionStorage.getItem("adminId");
  role = sessionStorage.getItem("adminRole");
  addNewBill: FormGroup;
  includes: any;
  qty: any;
  unitPrice: any;
  chargeSetting: any;
  processingFees: any;
  VatCharge: any;
  creatorsList = [];
  projectList = [];
  isSelectValue: any;
  isAllNothing: any;
  keepItAll: any;
  keepItPercentage: any;
  keepItCharge: any;
  serviceList = [];
  paymentPercentage: any;
  projectName: any;
  parmId: any;
  projectId: any;
  serviceType: any; 
  serviceId: any;
  isShow: any;
  serviceCreteId: any;
  createId: any;
  useId: any;
  useName: any;
  status = true;
  projectFullDetail: any;
  paymentModel_Percent : any;
  paymentModel : any;
  includesSeperated = [];
  dataSeperated = {
    dueAmount: null,
    totalAmount: null,
    paymentModel_Percent: null,
    paymentModel: null,
    discount: 0,
    VAT: null,
    processing_Fees: null
  };

  constructor(
    private apiCall: ApiCallService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe((params) => (this.parmId = params.id));
    this.route.params.subscribe(
      (params) => (this.serviceCreteId = params.user_id)
    );
    this.route.params.subscribe(
      (params) => (this.projectId = params.project_id)
    );

    var str = this.parmId;
    var splitted = str.split("-");

    if (splitted[0] == "proj") {
      this.projectId = splitted[1];
      this.serviceType = "project";
      this.isShow = true;
      this.projectSelectClick();
    } else if (splitted[0] == "special") {
      this.serviceId = splitted[1];
      this.serviceType = "specialService";
      this.isShow = false;
      this.fetchCommonCharges();
    }
    this.fetchCreatorsList();
    this.getProjectInfo();

    this.breadCrumbItems = [
      { label: "Billing" },
      { label: "Add New Bill", active: true },
    ];
    this.addNewBill = this.formBuilder.group({
      serviceType: [this.serviceType],
      userId: [""],
      projectId: [""],
      serviceId: [this.serviceId],
      includes:  [[]],
      dueAmount: [""],
      dueDate: [""],
      totalAmount: [""],
      processing_Fees_Percent: [""],
      processing_Fees: [""],
      VAT_Percent: [""],
      VAT: [""],
      paymentModel_Percent: [""],
      paymentModel: [""],
      discount: [""],
    });

    this.dataSeperated = {
      dueAmount: null,
      totalAmount: null,
      paymentModel_Percent: null,
      paymentModel: null,
      discount: 0,
      VAT: null,
      processing_Fees: null
    }


    this.includesSeperated = [
      { 
        description: '',
        quantity: 1,
        unitPrice: null,
        total: null
      }
    ]

  }

  onSubmit() {
    this.addNewBill.value['includes'] = this.includesSeperated.filter(obj => obj.unitPrice !== null )
    this.addNewBill.value['dueAmount'] = this.dataSeperated['dueAmount'];
    this.addNewBill.value['discount'] = this.dataSeperated['discount'];
    this.addNewBill.value['VAT'] = this.dataSeperated['VAT'];
    this.addNewBill.value['paymentModel'] = this.dataSeperated['paymentModel'];
    this.addNewBill.value['paymentModel_Percent'] = this.dataSeperated['paymentModel_Percent'];
    this.addNewBill.value['processing_Fees'] = this.dataSeperated['processing_Fees'];
    this.addNewBill.value['totalAmount'] = this.dataSeperated['totalAmount'];
    this.addNewBill.value['userId'] = this.serviceCreteId;

    const postData = this.addNewBill.value;
    postData["createdBy"] = this.updatedby;
    postData["userType"] = "admin";
    postData["role"] = this.role;

    var params = {
      url: "admin/makeBillForUser",
      data: postData,
    };
    this.apiCall.commonPostService(params).subscribe(
      (response: any) => {
        if (response.body.error == false) {
          this.addNewBill.reset();
          this.apiCall.showToast(
            response.body.message,
            "Success",
            "successToastr"
          );
          this.ngOnInit();
          this.router.navigateByUrl("/bill_list");
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

  onChangeDiscount(ele){
    this.dataSeperated['discount'] = parseInt(ele.target.value)

    let total = this.returnTotal(
      this.dataSeperated['dueAmount'],
      this.dataSeperated['processing_Fees'],
      this.dataSeperated['VAT'], 
      this.dataSeperated['paymentModel']
    )

    if(this.dataSeperated['discount'] >= 0){
      this.dataSeperated['totalAmount'] =  total - this.dataSeperated['discount']
    }else{
      this.dataSeperated['totalAmount'] = total
    }
  }

  async addOptions() {
    this.includesSeperated.push(
      { 
        description: '',
        quantity: 1,
        unitPrice: null,
        total: null
      });

    if(this.includesSeperated.length > 0) {
      let returned = 0;

      await this.includesSeperated.reduce(
        async (promise, element) => {
            if(element.total !== null){
              returned = returned + parseInt(element.total)
            }
            await promise;
        },Promise.resolve()
      )

      this.dataSeperated['dueAmount'] = returned
      this.dataSeperated['processing_Fees'] = this.percentageCalculator(this.dataSeperated['dueAmount'], this.addNewBill.value['processing_Fees_Percent']);
      this.dataSeperated['VAT'] = this.percentageCalculator(this.dataSeperated['dueAmount'], this.addNewBill.value['VAT_Percent']);
      this.dataSeperated['paymentModel'] = this.percentageCalculator(this.dataSeperated['dueAmount'], this.dataSeperated['paymentModel_Percent']);
  
      this.dataSeperated['totalAmount'] = this.returnTotal(
        this.dataSeperated['dueAmount'],
        this.dataSeperated['processing_Fees'],
        this.dataSeperated['VAT'], 
        this.dataSeperated['paymentModel']
      ) - this.dataSeperated['discount']
    }
    
  }

  async deleteOptions(index) {
    this.includesSeperated.splice(index, 1);

    if(this.includesSeperated.length > 0) {
      let returned = 0;

      await this.includesSeperated.reduce(
        async (promise, element) => {
            if(element.total !== null){
              returned = returned + parseInt(element.total)
            }
            await promise;
        },Promise.resolve()
      )

      this.dataSeperated['dueAmount'] = returned
      this.dataSeperated['processing_Fees'] = this.percentageCalculator(this.dataSeperated['dueAmount'], this.addNewBill.value['processing_Fees_Percent']);
      this.dataSeperated['VAT'] = this.percentageCalculator(this.dataSeperated['dueAmount'], this.addNewBill.value['VAT_Percent']);
      this.dataSeperated['paymentModel'] = this.percentageCalculator(this.dataSeperated['dueAmount'], this.dataSeperated['paymentModel_Percent']);
  
      this.dataSeperated['totalAmount'] = this.returnTotal(
        this.dataSeperated['dueAmount'],
        this.dataSeperated['processing_Fees'],
        this.dataSeperated['VAT'], 
        this.dataSeperated['paymentModel']
      ) - this.dataSeperated['discount']
    }
  }

  returnTotal(due, process, VAT, model){
    return (parseInt(due) + parseInt(process) + parseInt(VAT) + parseInt(model))
  }

  onChangeValue(ele, index){
    if(ele.target.id !== 'description'){
      this.includesSeperated[index][ele.target.id] = parseInt(ele.target.value)
    }else{
      this.includesSeperated[index][ele.target.id] = ele.target.value
    }
    if(ele.target.id == 'unitPrice' || ele.target.id == 'quantity'){
      this.includesSeperated[index]['total'] = parseInt(this.includesSeperated[index]['quantity']) * parseInt(this.includesSeperated[index]['unitPrice'])
    }
  }

  getProjectInfo() {
    let params = {
      url: "admin/listProject",
    };
    this.apiCall.smallGetService(params).subscribe(
      (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          let temp;
          this.projectList = resu.data.filter((data)=> {
            return data._creatorId_ == this.serviceCreteId && data._is_On_Live_
          });
          temp = this.projectList.find((data) => data._id == this.projectId )
          this.projectName = temp ? temp.title : null
          if(!this.projectName){
            this.addNewBill.value['projectId'] = "";
            this.projectId = "";
            this.keepItPercentage = null
          }else{
            this.addNewBill.value['projectId'] = this.projectId;
            this.projectFullDetail = temp;
            this.keepItPercentage = this.projectFullDetail._is_Keep_It_All_
            this.dataSeperated['paymentModel_Percent'] = this.projectFullDetail._is_All_Nothing_ ? this.chargeSetting.allAreNothingCommission : this.chargeSetting.keepItAllCommission
          }
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  statusChange(){
    this.status = false;
    this.projectId = this.addNewBill.controls['projectId'].value

    this.projectFullDetail = this.projectList.find((data) => data._id == this.projectId)

    if(this.projectFullDetail){
      this.dataSeperated['paymentModel_Percent'] = this.projectFullDetail._is_All_Nothing_ ? this.chargeSetting.allAreNothingCommission : this.chargeSetting.keepItAllCommission
    }
  }

  fetchCreatorsList() {
    let params = {
      url: "admin/getCreatorList",
    };
    this.apiCall.subCommonGetService(params).subscribe(
      (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          this.creatorsList = resu.data;
          this.createId = this.creatorsList.find((ele) => {
            return ele._id == this.serviceCreteId;
          });
          this.useId = this.createId._id;
          this.useName = this.createId.userName;
        } else {
          this.apiCall.showToast(resu.message, "Error", "errorToastr");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  percentageCalculator(amount, percent) {   
    return ((percent * amount) / 100).toFixed(0)
  }

  fetchCommissionData(val) {
    let params = {
      url: "admin/getAllChargesList",
    };
    this.apiCall.commonGetService(params).subscribe(
      (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          this.chargeSetting = resu.data;

          this.processingFees = resu.data.processing_Fees;

          this.VatCharge = resu.data.VAT;

          this.addNewBill = this.formBuilder.group({
            processing_Fees_Percent: [resu.data.processing_Fees, []],
            VAT_Percent: [resu.data.VAT, []],
            processing_Fees: [this.processingFees, []],
            VAT: [this.VatCharge, []],
            includes: [[]],
            userId: [""],
            projectId: [],
            serviceType: [this.serviceType],
            serviceId: [this.serviceId],
            dueAmount: [""],
            dueDate: [""],
            totalAmount: [""],

            paymentModel_Percent: [this.keepItPercentage != null ? this.keepItPercentage ? resu.data.keepItAllCommission : resu.data.allAreNothingCommission : null],
            paymentModel: [this.keepItCharge, []],
            discount: [""],
          });
        } else {
          this.apiCall.showToast(resu.message, "Error", "errorToastr");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  fetchCommonCharges() {
    let params = {
      url: "admin/getAllChargesList",
    };
    this.apiCall.commonGetService(params).subscribe(
      (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          this.chargeSetting = resu.data;
          this.addNewBill = this.formBuilder.group({
            processing_Fees_Percent: [resu.data.processing_Fees, []],
            VAT_Percent: [resu.data.VAT, []],
            processing_Fees: [null, []],
            VAT: [null, []],
            includes: [[]],
            userId: [""],
            projectId: [],
            serviceType: [this.serviceType],
            serviceId: [this.serviceId],
            dueAmount: [""],
            dueDate: [""],
            totalAmount: [""],

            paymentModel_Percent: [this.keepItPercentage != null ? this.keepItPercentage ? resu.data.keepItAllCommission : resu.data.allAreNothingCommission : null],
            paymentModel: [""],
            discount: [""],
          });
        } else {
          this.apiCall.showToast(resu.message, "Error", "errorToastr");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  projectSelectClick() {
    let params = {
      url: "admin/getProjectListById",
      projectId: this.projectId,
    };
    this.apiCall.projectGetService(params).subscribe(
      (result: any) => {
        let resu = result.body;
        if (resu.error == false) {
          this.isAllNothing = resu.data._is_All_Nothing_;
          this.keepItAll = resu.data._is_Keep_It_All_;

          if (this.isAllNothing == true) {
            this.paymentPercentage = 0;
          } else if (this.keepItAll == true) {
            this.paymentPercentage = 1;
          }

          this.fetchCommissionData(this.paymentPercentage);
        } else {
          this.apiCall.showToast(resu.message, "Error", "errorToastr");
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

}
