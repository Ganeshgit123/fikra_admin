import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdvancedtableComponent } from './advancedtable/advancedtable.component';
import { ProjectsComponent } from './projects/projects.component';
import { InvestorsComponent } from './investors/investors.component';
import { CreatorsComponent } from './creators/creators.component';

const routes: Routes = [
    {
        path: 'advanced',
        component: AdvancedtableComponent
    },
    {
        path: 'investors',
        component: InvestorsComponent
    },
    {
        path: 'projects',
        component: ProjectsComponent
    },
    {
        path: 'creators',
        component: CreatorsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TablesRoutingModule { }
