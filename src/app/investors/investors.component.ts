import { Component, OnInit, ViewChildren, QueryList,PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { ApiCallService } from '../services/api-call.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AdvancedSortableDirective, SortEvent,SortDirection } from '../services/advanced-sortable.directive';

interface Table {
  fullName: any;
  userName: any;
  country: any;
  city: any;
  street: any;
  mobileNumber: any;
  _send_me_newsletter_: any;
  _userRole_: any;
  _is_mobile_verified_: any;
  _is_admin_arroved_: any;
  _id:any;
}
interface SearchResult {
  tables: Table[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

/**
* Sort the table data
* @param tabless Table field value
* @param column Fetch the column
* @param direction Sort direction Ascending or Descending
*/
function sort(tables: Table[], column: string, direction: string): Table[] {
  if (direction === '') {
      return tables;
  } else {
      return [...tables].sort((a, b) => {
          const res = compare(a[column], b[column]);
          return direction === 'asc' ? res : -res;
      });
  }
}

/**
* Table Data Match with Search input
* @param tables Table field value fetch
* @param term Search the value
*/
function matches(tables: Table, term: string, pipe: PipeTransform) {
  return tables.fullName.toLowerCase().includes(term)
      || tables.userName.toLowerCase().includes(term)
      || tables.country.toLowerCase().includes(term)
      || pipe.transform(tables.city).includes(term)
      || tables.street.toLowerCase().includes(term)
      || tables.mobileNumber.toLowerCase().includes(term);
}

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.scss'],
  providers: [DecimalPipe]
})

export class InvestorsComponent implements OnInit {
 // bread crum data
 breadCrumbItems: Array<{}>;
 updateInvestor: FormGroup;
 _user_ID_ : any;

 getuserList: any=[];

 accToken = sessionStorage.getItem('access_token');

  updatedby = sessionStorage.getItem('adminId');
  role = sessionStorage.getItem('adminRole');

 private _loading$ = new BehaviorSubject<boolean>(true);
    // tslint:disable-next-line: variable-name
    private _search$ = new Subject<void>();
    // tslint:disable-next-line: variable-name
    private _tables$ = new BehaviorSubject<Table[]>([]);
    // tslint:disable-next-line: variable-name
    private _total$ = new BehaviorSubject<number>(0);

        // tslint:disable-next-line: variable-name
        private _state: State = {
          page: 1,
          pageSize: 10,
          searchTerm: '',
          sortColumn: '',
          sortDirection: '',
          startIndex: 1,
          endIndex: 10,
          totalRecords: 0
      };

      
 @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

 constructor(private pipe: DecimalPipe,
  private apiCall: ApiCallService,
  private formBuilder: FormBuilder,) {
  //  this.tables$ = service.tables$;
  //  this.total$ = service.total$;
   this._search$.pipe(
    tap(() => this._loading$.next(true)),
    debounceTime(200),
    switchMap(() => this._search()),
    delay(200),
    tap(() => this._loading$.next(false))
).subscribe(result => {
    this._tables$.next(result.tables);
    this._total$.next(result.total);
});

this._search$.next();
 }

     /**
     * Returns the value
     */
      get tables$() { return this._tables$.asObservable(); }
      get total$() { return this._total$.asObservable(); }
      get loading$() { return this._loading$.asObservable(); }
      get page() { return this._state.page; }
      get pageSize() { return this._state.pageSize; }
      get searchTerm() { return this._state.searchTerm; }
      get startIndex() { return this._state.startIndex; }
      get endIndex() { return this._state.endIndex; }
      get totalRecords() { return this._state.totalRecords; }
  
      /**
       * set the value
       */
      // tslint:disable-next-line: adjacent-overload-signatures
      set page(page: number) { this._set({ page }); }
      // tslint:disable-next-line: adjacent-overload-signatures
      set pageSize(pageSize: number) { this._set({ pageSize }); }
      // tslint:disable-next-line: adjacent-overload-signatures
      // tslint:disable-next-line: adjacent-overload-signatures
      set startIndex(startIndex: number) { this._set({ startIndex }); }
      // tslint:disable-next-line: adjacent-overload-signatures
      set endIndex(endIndex: number) { this._set({ endIndex }); }
      // tslint:disable-next-line: adjacent-overload-signatures
      set totalRecords(totalRecords: number) { this._set({ totalRecords }); }
      // tslint:disable-next-line: adjacent-overload-signatures
      set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
      set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
      set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }
  


 ngOnInit() {

   this.breadCrumbItems = [{ label: 'Invesors List', active: true }];

   this._fetchData();

   this.updateInvestor = this.formBuilder.group({
    fullName: ['',  []],
    userName: ['',  []],
    country: ['',  []],
    city: ['',  []],
    street: ['',  []],
    mobileNumber: ['',  []],
    _is_admin_arroved_: ['',  []],
    _is_mobile_verified_: ['',  []],
    _send_me_newsletter_: ['',  []],
    _userRole_: ['',  []],
  });
 }


 _fetchData() {

  let params = {
    url: "admin/getUserListWithFilter",
  }  
  this.apiCall.userGetService(params).subscribe((result:any)=>{
    let resu = result.body;
    if(resu.error == false)
    {
         this.getuserList = resu.data;
   this.getuserList.forEach(element => {
    element['isEdit'] = false;
  });
        //  console.log("list",this.getuserList)
    }else{
      this.apiCall.showToast(resu.message, 'Error', 'errorToastr')
    }
  },(error)=>{
     console.error(error);
     
  });


 }

 getTableData(data){
   console.log("fef",data)
   data.isEdit = true;

  //  var dob = new Date(data['dob']);

    this._user_ID_ = data['_id'] 

   this.updateInvestor   = this.formBuilder.group({
    fullName: [data['fullName'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    userName: [data['userName'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    country: [data['country'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    city: [data['city'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    street: [data['street'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    mobileNumber: [data['mobileNumber'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    // dob: [dob, [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    _send_me_newsletter_: [data['_send_me_newsletter_'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    _is_admin_arroved_: [data['_is_admin_arroved_'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
    _userRole_: [data['_userRole_'],  [ Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
  })
 }

 close(data){
  data.isEdit = false;
 }

 onSubmit(){

 }


 /**
  * Sort table data
  * @param param0 sort the column
  *
  */
 onSort({ column, direction }: SortEvent) {
   // resetting other headers
   this.headers.forEach(header => {
     if (header.sortable !== column) {
       header.direction = '';
     }
   });
   this.sortColumn = column;
   this.sortDirection = direction;
 }
 private _set(patch: Partial<State>) {
  Object.assign(this._state, patch);
  this._search$.next();
}

/**
* Search Method
*/

 private _search(): Observable<SearchResult> {
  const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

  // 1. sort
  let tables = sort(this.getuserList, sortColumn, sortDirection);
  // 2. filter
  tables = tables.filter(table => matches(table, searchTerm, this.pipe));
  const total = tables.length;

  // 3. paginate
  this.totalRecords = tables.length;
  
  this._state.startIndex = (page - 1) * this.pageSize + 1;

  this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;

  if (this.endIndex > this.totalRecords) {
      this.endIndex = this.totalRecords;
  }
  // tables = tables.slice(this._state.startIndex - 1, this._state.endIndex - 1);

  return of(
      { tables, total }
  );
}

}

