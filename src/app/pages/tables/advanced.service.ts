import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { SortDirection } from './advanced-sortable.directive';

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
        || tables.position.toLowerCase().includes(term)
        || tables.office.toLowerCase().includes(term)
        || pipe.transform(tables.age).includes(term)
        || tables.date.toLowerCase().includes(term)
        || tables.salary.toLowerCase().includes(term);
}

@Injectable({
    providedIn: 'root'
})

export class AdvancedService {
    // tslint:disable-next-line: variable-name
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

    constructor(private pipe: DecimalPipe) {
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
        let tables = sort(tableData, sortColumn, sortDirection);

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
        tables = tables.slice(this._state.startIndex - 1, this._state.endIndex - 1);

        return of(
            { tables, total }
        );
    }
}
