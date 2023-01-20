import { Component, OnInit } from '@angular/core';
import { SubTopic } from '../sub-topic';
import { SubTopicService } from '../sub-topic.service';
import { CreateSubTopicComponent } from '../create-sub-topic/create-sub-topic.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-index-sub-topic',
  templateUrl: './index-sub-topic.component.html',
  styleUrls: ['./index-sub-topic.component.css']
})
export class IndexSubTopicComponent implements OnInit {

  subTopics: SubTopic[] = [];
  size = 'large';
  isTranslated = false;
  constructor(public subTopicService: SubTopicService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    try {
      this.subTopicService.getAll().subscribe((data: SubTopic[]) => {
        this.subTopics = data;
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
        nzContent:  this.translate.instant('general.modal_se_cierra'),
        nzOnOk: () => {
          try {
            this.subTopicService.destroy(id).subscribe(res => {
              this.subTopics = this.subTopics.filter(item => item.id !== id);
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
      this.modalService.create({
        nzTitle: id? this.translate.instant('general.actualizar'): this.translate.instant('general.crear') +' '+this.translate.instant('general.sub_tema'),
        nzContent: CreateSubTopicComponent,
        nzFooter: null,
        nzComponentParams: {
          InputData: id,
          FormsData: this.subTopics
        }
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }
  }
}
