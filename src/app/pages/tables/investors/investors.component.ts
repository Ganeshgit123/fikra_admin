import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { AdvancedService } from '../advanced.service';
import { AdvancedSortableDirective, SortEvent } from '../advanced-sortable.directive';

interface Table {
  name: string;
  position: string;
  office: string;
  age: number;
  date: string;
  salary: string;
  unit: number;
  enddate: string;
}

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

 name: string;
    position: string;
    office: string;
    age: number;
    date: string;
    salary: string;
    unit: number;
    enddate: string;

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
  const tableData = [
    {
      name: 'Timoteo Lyddy',
      position: 'Recruiting Manager',
      office: 'Vidago',
      age: 29,
      date: '2018/12/04',
      salary: '$11700',
      unit: 78,
      enddate: '2020/12/06'
    }, {
      name: 'Cherye Bleby',
      position: 'Quality Engineer',
      office: 'La Concordia',
      age: 62,
      date: '2018/10/04',
      salary: '$14700',
      unit: 88,
      enddate: '2020/12/08'
    }, {
      name: 'Zacharias O\'Shaughnessy',
      position: 'Senior Editor',
      office: 'Maungatapere',
      age: 26,
      date: '2018/07/30',
      salary: '$11600',
      unit: 89,
      enddate: '2020/12/10'
    }, {
      name: 'Odie Jentin',
      position: 'Programmer II',
      office: 'Grabovci',
      age: 26,
      date: '2019/05/16',
      salary: '$11200',
      unit: 90,
      enddate: '2020/06/08'
    }, {
      name: 'Eugenie Sang',
      position: 'Operator',
      office: 'Oxbow',
      age: 59,
      date: '2019/07/16',
      salary: '$15200',
      unit: 98,
      enddate: '2020/05/08'
    }, {
      name: 'Sammy Guyers',
      position: 'Mechanical Systems Engineer',
      office: 'Sanhe',
      age: 53,
      date: '2019/07/09',
      salary: '$14200',
      unit: 78,
      enddate: '2020/05/09'
    }, {
      name: 'Tarah Blick',
      position: 'Paralegal',
      office: 'Fylí',
      age: 23,
      date: '2018/12/14',
      salary: '$15200',
      unit: 68,
      enddate: '2020/05/15'
    }, {
      name: 'Jemie Ormshaw',
      position: 'Systems Administrator II',
      office: 'Vila Fria',
      age: 28,
      date: '2019/05/15',
      salary: '$14400',
      unit: 56,
      enddate: '2020/05/18'
    }, {
      name: 'Gerrie Semeradova',
      position: 'Research Associate',
      office: 'Balykchy',
      age: 26,
      date: '2018/09/28',
      salary: '$14900',
      unit: 89,
      enddate: '2020/05/20'
    }, {
      name: 'Ottilie Mostyn',
      position: 'Accounting Assistant II',
      office: 'Eskilstuna',
      age: 43,
      date: '2018/08/20',
      salary: '$11300',
      unit: 88,
      enddate: '2020/06/20'
    }, {
      name: 'Lombard Crepin',
      position: 'Project Manager',
      office: 'Novoul’yanovsk',
      age: 63,
      date: '2019/04/28',
      salary: '$13300',
      unit: 81,
      enddate: '2020/08/20'
    }, {
      name: 'Fons Sopp',
      position: 'Structural Analysis Engineer',
      office: 'Bealanana',
      age: 47,
      date: '2019/02/22',
      salary: '$13300',
      unit: 68,
      enddate: '2020/08/01'
    }
  ];
    
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

