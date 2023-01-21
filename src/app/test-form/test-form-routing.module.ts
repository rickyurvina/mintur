import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FillFormComponent } from './fill-form/fill-form.component';

const routes: Routes = [
  {
    path:'test-form',
    component: FillFormComponent,
    data:{
      title:'Test Form'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestFormRoutingModule { }
