import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UiModule } from '../../shared/ui/ui.module';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { TablesRoutingModule } from './tables-routing.module';
import { AdvancedSortableDirective } from './advanced-sortable.directive';
import { AdvancedtableComponent } from './advancedtable/advancedtable.component';
import { ProjectsComponent } from './projects/projects.component';
import { InvestorsComponent } from './investors/investors.component';
import { CreatorsComponent } from './creators/creators.component';

@NgModule({
  declarations: [AdvancedtableComponent, AdvancedSortableDirective, ProjectsComponent, InvestorsComponent, CreatorsComponent],
  imports: [
    CommonModule,
    TablesRoutingModule,
    UiModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FormsModule
  ]
})
export class TablesModule { }
