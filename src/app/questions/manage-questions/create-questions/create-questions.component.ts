import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { Question } from '../question';
import { QuestionService } from '../question.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { IndexQuestionsComponent } from '../index-questions/index-questions.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-questions',
  templateUrl: './create-questions.component.html',
  styleUrls: ['./create-questions.component.css']
})
export class CreateQuestionsComponent implements OnInit {
  @Input() InputData: any;
  @Input() FormsData: any;

  codes: string[] = [];
  id: number;
  question: Question;
  validateForm: FormGroup;

  optionList = [
    { label: 'Si/No', value: 'si_no' },
    { label: 'Rango 1-5', value: 'rango_1_5' }
  ];
  log(value: { label: string; value: string; age: number }): void {
    console.log(value);
  }

  public ngOnInit(): void {
    this.codes = [];

    if (this.InputData) {
      this.id = this.InputData;
      this.questionService.find(this.id).subscribe((data: Question) => {
        this.question = data;
        this.validateForm.setValue({
          name: this.question.name,
          code: this.question.code,
          type: this.question.type,
          description: this.question.description,
        })
        this.codes = this.FormsData.map(element => {
          return element['code'] != this.question.code;
        })
      }, err => {
        this.message.create('error', `Error: ${err}`);
      });
    } else {
      this.codes = this.FormsData.map(element => {
        return element['code'];
      })
    }
  }

  submitForm(value: { code: string; name: string; }): void {
    if (this.InputData) {
      try {
        this.questionService.update(this.id, value).subscribe(res => {
          for (const key in this.validateForm.controls) {
            if (this.validateForm.controls.hasOwnProperty(key)) {
              this.validateForm.controls[key].markAsDirty();
              this.validateForm.controls[key].updateValueAndValidity();
            }
          }
          this.message.create('success', this.translate.instant('mensajes.actualizado_exitosamente'));
          this.modalService.closeAll();
        }, err => {
          this.showErrors(err)
        });
      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }
    } else {
      try {
        this.questionService.create(value).subscribe(res => {
          for (const key in this.validateForm.controls) {
            if (this.validateForm.controls.hasOwnProperty(key)) {
              this.validateForm.controls[key].markAsDirty();
              this.validateForm.controls[key].updateValueAndValidity();
            }
          }
          this.message.create('success', this.translate.instant('mensajes.creado_exitosamente'));
          this.modalService.closeAll();
          this.indexQuestions.ngOnInit();
          this.router.navigate(['admin/manage-questions'])
        }, err => {
          this.showErrors(err)
        });
      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }
    }
    // this.router.navigateByUrl('forms/manage-forms')
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
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


  codeAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (this.codes.includes(control.value)) {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  constructor(private fb: FormBuilder,
    private questionService: QuestionService,
    private modalService: NzModalService,
    private router: Router,
    private indexQuestions: IndexQuestionsComponent,
    private message: NzMessageService,
    private translate: TranslateService) {

    this.validateForm = this.fb.group({
      code: ['', [Validators.required], [this.codeAsyncValidator]],
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', []],
    });
  }

}