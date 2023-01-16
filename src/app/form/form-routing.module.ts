import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {path: 'form',redirectTo:'form/index',pathMatch:'full'},
  {path: 'form/index',component:IndexComponent},
  {path: 'form/create',component:CreateComponent},
  {path: 'form/edit/:idForm',component:EditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRoutingModule { }
