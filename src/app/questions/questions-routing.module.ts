import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponentsComponent } from './manage-components/index-components/index-components.component';
import { ManageFormsComponent } from './manage-forms/index/manage-forms.component';
import { IndexQuestionsComponent } from './manage-questions/index-questions/index-questions.component';

const routes: Routes = [
  {
    path: 'manage-forms',
    component: ManageFormsComponent,
    data: {
      title: 'Formularios'
    }
  },
  {
    path: 'manage-questions',
    component: IndexQuestionsComponent,
    data: {
      title: 'Preguntas'
    }
  },
  {
    path: 'manage-components',
    component: IndexComponentsComponent,
    data: {
      title: 'Componentes'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionsRoutingModule { }
