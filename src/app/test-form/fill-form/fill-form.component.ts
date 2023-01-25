import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormService } from 'src/app/questions/manage-forms/form.service';
import { Form } from 'src/app/questions/manage-forms/form';
import { TranslateService } from '@ngx-translate/core';
import { Establishment } from '../establishment';
import { EstablishmentService } from '../establishment.service';
import { LocalService } from 'src/app/services/local.service';
import { SubTopic } from 'src/app/questions/manage-subtopic/sub-topic';
import {
  SubTopicService
} from 'src/app/questions/manage-subtopic/sub-topic.service';
@Component({
  selector: 'app-fill-form',
  templateUrl: './fill-form.component.html',
  styleUrls: ['./fill-form.component.css']
})

export class FillFormComponent implements OnInit {
  encapsulation: ViewEncapsulation.None
  establishmentForm: FormGroup;
  form: Form;
  emailEstablishment: string;
  establishment: Establishment;
  index = 0;
  disable = false;
  subTopic: SubTopic;
  offsetTop = 2;
  answers = {};
  value = 3;

  selectStep(id: number, index: number): void {
    this.index = index;
    this.subTopicService.find(id).subscribe((data: SubTopic) => {
      this.subTopic = data;
    }, err => {
      this.message.create('error', `Error: ${err}`);
    });
  }

  handleTabChange(event) {
    this.subTopic = null;
    this.index = 0;
  }

  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    private formService: FormService,
    private translate: TranslateService,
    private establishmentService: EstablishmentService,
    private localStore: LocalService,
    private subTopicService: SubTopicService,
  ) {
    this.establishmentForm = this.fb.group({
      name: ['', [Validators.required]],
      company: ['', []],
      email: ['', [Validators.required, Validators.email]],
    });

    translate.addLangs(['es', 'en']);
    translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    try {
      this.formService.showActiveForm().subscribe((data: Form) => {
        this.form = data;
      }, err => {
        this.message.create('error', `Error: ${err}`);
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }

    if (this.localStore.getData('email')) {
      try {
        this.emailEstablishment = this.localStore.getData('email');
        this.establishmentService.showActiveEstablishment(this.emailEstablishment).subscribe((data: Establishment) => {
          this.establishment = data;
        }, err => {
          this.message.create('error', `Error: ${err}`);
        });
      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }
    }
  }

  submitForm(value: { name: string; email: string; company: string }): void {
    try {
      this.establishmentService.create(value).subscribe(res => {
        for (const key in this.establishmentForm.controls) {
          if (this.establishmentForm.controls.hasOwnProperty(key)) {
            this.establishmentForm.controls[key].markAsDirty();
            this.establishmentForm.controls[key].updateValueAndValidity();
          }
        }
        this.emailEstablishment = value.email;
        this.localStore.saveData('email', this.emailEstablishment);
        this.message.create('success', this.translate.instant('mensajes.creado_exitosamente'));
        this.ngOnInit();

      }, err => {
        this.showErrors(err)
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }
  }

  showErrors(err) {
    const messagesArr = [];
    if (err.error) {
      messagesArr.push(err.error.message);
      if (err.error.errors) {
        for (const property in err.error.errors) {
          if (err.error.errors.hasOwnProperty(property)) {
            const propertyErrors: Array<string> = err.error.errors[property];
            propertyErrors.forEach(error => messagesArr.push(error));
          }
        }
      }
    }
    messagesArr.forEach(element => {
      this.message.create('error', `${element}`)
    });
  }

  onChange(idQuestion: number, answer: string, value: any): void {
    console.log(idQuestion, answer);
    console.log(value);
  }

}
