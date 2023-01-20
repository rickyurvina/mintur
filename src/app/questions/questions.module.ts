import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionsRoutingModule } from './questions-routing.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ManageFormsComponent } from './manage-forms/index/manage-forms.component';
import { IndexQuestionsComponent } from './manage-questions/index-questions/index-questions.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { IndexComponentsComponent } from './manage-components/index-components/index-components.component';
import { CreateComponentsComponent } from './manage-components/create-components/create-components.component';
import { IndexSubTopicComponent } from './manage-subtopic/index-sub-topic/index-sub-topic.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTableModule } from 'ng-zorro-antd/table';
const antdModule= [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzCheckboxModule,
    NzSkeletonModule,
    NzTagModule,
    NzDividerModule,
    NzToolTipModule,
    NzTableModule
]

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        QuestionsRoutingModule,
        ...antdModule
    ],
    declarations: [
        ManageFormsComponent,
        IndexQuestionsComponent,
        IndexComponentsComponent,
        CreateComponentsComponent,
        IndexSubTopicComponent,
    ]
})

export class QuestionsModule {}
