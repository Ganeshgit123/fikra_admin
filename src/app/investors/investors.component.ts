import { Component, OnInit, ViewChildren, QueryList,PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { AdvancedSortableDirective, SortEvent,SortDirection } from '../tables/advanced-sortable.directive';

interface Table {
  name: any;
  address: any;
  country: any;
  city: any;
  mobile: any;
  dob: any;
  email: any;
  password: any;
  newsletters: any;
  research: any;
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
  return tables.name.toLowerCase().includes(term)
      || tables.address.toLowerCase().includes(term)
      || tables.country.toLowerCase().includes(term)
      || pipe.transform(tables.dob).includes(term)
      || tables.mobile.toLowerCase().includes(term)
      || tables.email.toLowerCase().includes(term);
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

 // Table data
 tableData: Table[];

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

 constructor(private pipe: DecimalPipe) {
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
 }


 _fetchData() {
   
const tableData = [
  {
    name: 'Ganesh kumar',
    address: '121, Sample street, chennai -600057',
    country: 'India',
    city: 'chennai',
    mobile: '9009090900',
    dob: '2020/12/06',
    email: 'sample@gmail.com',
    password: 'somepassword',
    newsletters: 'true',
    research: 'true'
  }
];

   this.tableData = tableData;

   this.tableData.forEach(element => {
     element['isEdit'] = false;
   });

 }

 getTableData(data){
   data.isEdit = true;
 }

 close(data){
  data.isEdit = false;
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
  let tables = sort(this.tableData, sortColumn, sortDirection);

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

