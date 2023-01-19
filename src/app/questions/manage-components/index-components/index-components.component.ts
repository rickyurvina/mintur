import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../component.service';
import { Component as Comp } from '../component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CreateComponentsComponent } from '../create-components/create-components.component';

@Component({
  selector: 'app-index-components',
  templateUrl: './index-components.component.html'
})
export class IndexComponentsComponent implements OnInit {

  components: Comp[] = [];
  size = 'large';
  isTranslated = false;

  constructor(public compService: ComponentService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    try {
      this.compService.getAll().subscribe((data: Comp[]) => {
        this.components = data;
        console.log(this.components)
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
            this.compService.destroy(id).subscribe(res => {
              this.components = this.components.filter(item => item.id !== id);
              this.message.create('success', this.translate.instant('mensajes.eliminado_exitosamente'));
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
        nzTitle: id ? this.translate.instant('general.crear') : this.translate.instant('general.actualizar') + ' ' + this.translate.instant('general.sub_tema'),
        nzContent: CreateComponentsComponent,
        nzFooter: null,
        nzComponentParams: {
          InputData: id,
          FormsData: this.components
        }
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }
  }
}
