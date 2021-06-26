import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvancedtableComponent } from './advancedtable/advancedtable.component';

const routes: Routes = [
    {
        path: 'advanced',
        component: AdvancedtableComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TablesRoutingModule { }
