import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { Table } from '../advanced.model';

import { tableData } from '../data';

import { AdvancedService } from '../advanced.service';
import { AdvancedSortableDirective, SortEvent } from '../advanced-sortable.directive';

@Component({
  selector: 'app-investors',
  templateUrl: './investors.component.html',
  styleUrls: ['./investors.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class InvestorsComponent implements OnInit {
 // bread crum data
 breadCrumbItems: Array<{}>;
 hideme: boolean[] = [];

 // Table data
 tableData: Table[];

 tables$: Observable<Table[]>;
 total$: Observable<number>;

 @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

 constructor(public service: AdvancedService) {
   this.tables$ = service.tables$;
   this.total$ = service.total$;
 }
 ngOnInit() {

   this.breadCrumbItems = [{ label: 'Invesors List', active: true }];

   /**
    * fetch data
    */
   this._fetchData();
 }


 changeValue(i) {
   this.hideme[i] = !this.hideme[i];
 }

 /**
  * fetches the table value
  */
 _fetchData() {
   this.tableData = tableData;
   for (let i = 0; i <= this.tableData.length; i++) {
     this.hideme.push(true);
   }
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
   this.service.sortColumn = column;
   this.service.sortDirection = direction;
 }
}

