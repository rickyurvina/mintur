import { Component, OnInit } from '@angular/core';
import { Establishment } from 'src/app/test-form/establishment';
import { EstablishmentService } from 'src/app/test-form/establishment.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-manage-establishments',
  templateUrl: './manage-establishments.component.html',
  styleUrls: ['./manage-establishments.component.css']
})
export class ManageEstablishmentsComponent implements OnInit {
  establishments: Establishment[] = [];

  constructor(private establishmentService: EstablishmentService,
    private message: NzMessageService) { }

  ngOnInit(): void {
    try {
      this.establishmentService.getAll().subscribe((data: Establishment[]) => {
        this.establishments = data;
        console.log(this.establishments)
      }, err => {
        this.message.create('error', `Error: ${err}`);
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }
  }

}
