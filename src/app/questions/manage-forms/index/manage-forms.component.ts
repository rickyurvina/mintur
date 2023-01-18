import { Component, OnInit } from '@angular/core';
import { FormService } from '../form.service';
import { Form } from '../form';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateFormComponent } from '../create-form/create-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-manage-forms',
  templateUrl: './manage-forms.component.html',
  styleUrls: ['./manage-forms.component.css']
})

export class ManageFormsComponent implements OnInit {
  forms: Form[] = [];
  size = 'large';

  constructor(public formService: FormService,
    private modalService: NzModalService,
    private message: NzMessageService) {
  }

  ngOnInit(): void {
    try {
      this.formService.getAll().subscribe((data: Form[]) => {
        this.forms = data;
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
        nzTitle: 'Seguro que desea eliminar este item?',
        nzContent: 'El modal se cierra automáticamente',
        nzOnOk: () => {
          try {
            this.formService.destroy(id).subscribe(res => {
              this.forms = this.forms.filter(item => item.id !== id);
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
        nzTitle: 'Crear Formulario',
        nzContent: CreateFormComponent,
        nzFooter: null,
        nzComponentParams: {
          InputData: id
        }
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }
  }
}
