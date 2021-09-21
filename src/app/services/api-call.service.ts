import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams,	} from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {

  baseUrl = environment.baseUrl;
  
  accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  
  role = sessionStorage.getItem('adminRole');

  constructor(private http: HttpClient, public toastr: ToastrManager) { }

  private cateData = new BehaviorSubject<string>('0');
  fieldEditFn = this.cateData.asObservable();

  fiedlValue(value) {
    this.cateData.next(value)
  }

  private createCateData = new BehaviorSubject<string>('0');
  createFieldEditFn = this.createCateData.asObservable();

  createFiedlValue(value) {
    this.createCateData.next(value)
  }

  private templateData = new BehaviorSubject<string>('0');
  templateEditFn = this.templateData.asObservable();

  templateValue(value){
    this.templateData.next(value)
  }

  adminLogin(apiData) {

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
   
    return this.http.post(this.baseUrl + 'admin/adminLogin', apiData, {      
      headers: httpHeaders,
      observe: 'response'
    });
  }

  commonGetService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    const httpHeaders = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'auth': this.accToken,
    });
    return this.http.get(this.baseUrl + params.url,  {
      params: new HttpParams()
      .set('createdBy', this.updatedby)
      .set('userType', 'admin')
      .set('role',this.role ),
      headers: httpHeaders,
      observe: 'response'
    });
  }

  subCommonGetService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    const httpHeaders = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'auth': this.accToken,
    });
    return this.http.get(this.baseUrl + params.url,  {
      params: new HttpParams()
      .set('updatedby', this.updatedby)
      .set('userType', 'admin')
      .set('role',this.role ),
      headers: httpHeaders,
      observe: 'response'
    });
  }

  smallGetService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'auth': this.accToken,
    });
    return this.http.get(this.baseUrl + params.url,  {
      params: new HttpParams()
      .set('createdby', this.updatedby)
      .set('userType', 'admin')
      .set('role',this.role )
      .set('user_Id',params.user_Id),
      headers: httpHeaders,
      observe: 'response'
    });
  }

  handBookGetService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'auth': this.accToken,
    });
    return this.http.get(this.baseUrl + params.url,  {
      params: new HttpParams()
      .set('createdBy', this.updatedby)
      .set('userType', 'admin')
      .set('role',this.role )
      .set('handBookId',params.handBookId),
      headers: httpHeaders,
      observe: 'response'
    });
  }

  jobGetService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'auth': this.accToken,
    });
    return this.http.get(this.baseUrl + params.url,  {
      params: new HttpParams()
      .set('createdBy', this.updatedby)
      .set('userType', 'admin')
      .set('role',this.role )
      .set('jobsId',params.jobsId),
      headers: httpHeaders,
      observe: 'response'
    });
  }

  roleGetService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'auth': this.accToken,
    });
    return this.http.get(this.baseUrl + params.url,  {
      params: new HttpParams()
      .set('createdBy', this.updatedby)
      .set('userType', 'admin')
      .set('role',this.role )
      .set('roleId',params.roleId),
      headers: httpHeaders,
      observe: 'response'
    });
  }

  projectGetService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'auth': this.accToken,
    });
    return this.http.get(this.baseUrl + params.url,  {
      params: new HttpParams()
      .set('createdby', this.updatedby)
      .set('userType', 'admin')
      .set('role',this.role )
      .set('projectId',params.projectId),
      headers: httpHeaders,
      observe: 'response'
    });
  }

  projectLikedGetService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'auth': this.accToken,
    });
    return this.http.get(this.baseUrl + params.url,  {
      params: new HttpParams()
      .set('createdBy', this.updatedby)
      .set('userType', 'admin')
      .set('role',this.role )
      .set('projectId',params.projectId),
      headers: httpHeaders,
      observe: 'response'
    });
  }

  billGetService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'auth': this.accToken,
    });
    return this.http.get(this.baseUrl + params.url,  {
      params: new HttpParams()
      .set('createdBy', this.updatedby)
      .set('userType', 'admin')
      .set('role',this.role )
      .set('billId',params.billId),
      headers: httpHeaders,
      observe: 'response'
    });
  }

  userGetService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    this.updatedby = sessionStorage.getItem('adminId');
    this.role = sessionStorage.getItem('adminRole');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'auth': this.accToken,
    });

    return this.http.get(this.baseUrl + params.url,  {
      params: new HttpParams()
      .set('role',this.role )
      .set('updatedby', this.updatedby)
      .set('userType', 'admin')
      .set('userId',params.userId)
      .set('userRole',params.userRole),

      headers: httpHeaders,
      observe: 'response'
    });
  }

  commonPutService(params) {
    this.accToken = sessionStorage.getItem('access_token');
    const httpHeaders = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'auth': this.accToken,
    });
    return this.http.put(this.baseUrl + params.url, params.data , {
      headers: httpHeaders,
      observe: 'response'
    });
  }


  commonPostService(params) {
    
    this.accToken = sessionStorage.getItem('access_token');
   
    const httpHeaders = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'auth': this.accToken,
    });
    
    return this.http.post(this.baseUrl + params.url, params.data , {      
      headers: httpHeaders,
      observe: 'response'
    });
  }

  imageuploadFunctions(data) {
    return new Promise(resolve => {
      var response = {}
      this.fileUploadService(data).subscribe(
        res => {
          if(res.body['error'] == false){
            response['error'] = false
            response['uploadUrl'] = res.body['imageURL']
          } else {
            response['error'] = true
          }
          resolve(response)
        },
        err => {
          response['error'] = true
          resolve(response)
        }
      );
    });
  }

  fileUploadService(apiData) {
    const httpHeaders = new HttpHeaders({
      // 'Content-Type': [''],
      // 'Accept': 'application/json',
      // 'Authorization': this.accToken
    });
    return this.http.post(this.baseUrl + 'admin/ImageUpload', apiData, {
      headers: httpHeaders,
      observe: 'response'
    });
  }

  showToast(message, title, key) {
    // successToastr
    // errorToastr
    // warningToastr
    // infoToastr
    var option = {
      position: 'top-right',
      showCloseButton: true,
      maxShown: 2,
      toastTimeout: 2000,
      newestOnTop: true,
      animate: 'slideFromRight'
    }
    this.toastr[key](message, title, option);

  }

}
