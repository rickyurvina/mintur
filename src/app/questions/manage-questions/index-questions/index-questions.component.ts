import { Component, OnInit } from '@angular/core';
import { Question } from '../question';
import { QuestionService } from '../question.service';
import { CreateQuestionsComponent } from '../create-questions/create-questions.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-index-questions',
  templateUrl: './index-questions.component.html',
  styleUrls: ['./index-questions.component.css']
})
export class IndexQuestionsComponent implements OnInit {
  questions: Question[] = [];
  size = 'large';
  isTranslated = false;
  constructor(public questionService: QuestionService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    try {
      this.questionService.getAll().subscribe((data: Question[]) => {
        this.questions = data;
      }, err => {
        this.message.create('error', `Error: ${err}`);
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }
  }

  showConfirm(id): void {
    try {
      this.modalService.confirm({
        nzTitle: this.translate.instant('general.seguro_desea_eliminar'),
        nzContent: this.translate.instant('general.modal_se_cierra'),
        nzOnOk: () => {
          try {
            this.questionService.destroy(id).subscribe(res => {
              this.questions = this.questions.filter(item => item.id !== id);
              this.message.create('success', `Se ha eliminado correctamente`);
            }, err => {
              this.message.create('error', `Error: ${err}`);
            })
          } catch (e) {
            this.message.create('error', `Error: ${e}`);
          }
        }
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }
  }

  showModalCreate(id = null) {
    try {
      const modal = this.modalService.create({
        nzTitle: id ? this.translate.instant('general.actualizar') : this.translate.instant('general.crear') + ' ' + this.translate.instant('general.Pregunta'),
        nzContent: CreateQuestionsComponent,
        nzFooter: null,
        nzComponentParams: {
          InputData: id,
          FormsData: this.questions
        },
      });
      modal.afterClose.subscribe(() => this.ngOnInit());

    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }
  }
}
