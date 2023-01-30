import { Component, OnInit } from '@angular/core';
import { Establishment } from 'src/app/test-form/establishment';
import { EstablishmentService } from 'src/app/test-form/establishment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ShowEstablishmentComponent } from './show-establishment/show-establishment.component';

@Component({
  selector: 'app-manage-establishments',
  templateUrl: './manage-establishments.component.html',
  styleUrls: ['./manage-establishments.component.css']
})
export class ManageEstablishmentsComponent implements OnInit {
  establishments: Establishment[] = [];

  results:any[];
  forms:any[];

  constructor(private establishmentService: EstablishmentService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    try {
      this.establishmentService.getAll().subscribe((data: Establishment[]) => {
        this.establishments = data;
        this.results=data.map(function(element){
          return element['results']
        })

      }, err => {
        this.message.create('error', `Error: ${err}`);
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }
  }

  showEstablishment(id){
    try {
      const modal = this.modalService.create({
        nzTitle: 'Ver Información',
        nzContent: ShowEstablishmentComponent,
        nzComponentParams: {
          InputData: id,
        },
        nzFooter: null,
        nzWidth: '1000px',
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }
  }

}
