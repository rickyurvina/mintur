import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponentsComponent } from './manage-components/index-components/index-components.component';
import { ManageEstablishmentsComponent } from './manage-establishments/manage-establishments.component';
import { ManageFormsComponent } from './manage-forms/index/manage-forms.component';
import { IndexQuestionsComponent } from './manage-questions/index-questions/index-questions.component';
import { ManageResultsComponent } from './manage-results/manage-results.component';
import { IndexSubTopicComponent } from './manage-subtopic/index-sub-topic/index-sub-topic.component';

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
  {
    path: 'manage-sub-topics',
    component: IndexSubTopicComponent,
    data: {
      title: 'SubTemas'
    }
  },
  {
    path: 'manage-establishments',
    component: ManageEstablishmentsComponent,
    data: {
      title: 'Establecimientos'
    }
  },
  {
    path: 'manage-results',
    component: ManageResultsComponent,
    data: {
      title: 'Resultados'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionsRoutingModule { }
