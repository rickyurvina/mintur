import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageFormsComponent } from './manage-forms/index/manage-forms.component';

const routes: Routes = [
    {
        path: 'manage-forms',
        component: ManageFormsComponent,
        data: {
            title: 'Formularios'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QuestionsRoutingModule { }
