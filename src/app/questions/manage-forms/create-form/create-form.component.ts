import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { FormService } from '../form.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { ManageFormsComponent } from '../index/manage-forms.component';
import { Form } from '../form';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})

export class CreateFormComponent implements OnInit {

  @Input() InputData: any;
  @Input() FormsData: any;

  codes: string[] = [];
  id: number;
  form: Form;
  validateForm: FormGroup;

  public ngOnInit(): void {
    this.codes = [];

    if (this.InputData) {
      this.id = this.InputData;
      this.formService.find(this.id).subscribe((data: Form) => {
        this.form = data;
        this.validateForm.setValue({
          name: this.form.name,
          code: this.form.code
        })
      }, err => {
        this.message.create('error', `Error: ${err}`);
      });
    }
    this.codes = this.FormsData.map(element => {
      return element['code'];
    })
  }

  submitForm(value: { code: string; name: string; }): void {
    if (this.InputData) {
      try {
        this.formService.update(this.id, value).subscribe(res => {
          for (const key in this.validateForm.controls) {
            if (this.validateForm.controls.hasOwnProperty(key)) {
              this.validateForm.controls[key].markAsDirty();
              this.validateForm.controls[key].updateValueAndValidity();
            }
          }
          this.message.create('success', `Actualizado exitosamente`);
          this.modalService.closeAll();
        }, err => {
          this.showErrors(err)
        });
      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }
    } else {
      try {
        this.formService.create(value).subscribe(res => {
          for (const key in this.validateForm.controls) {
            if (this.validateForm.controls.hasOwnProperty(key)) {
              this.validateForm.controls[key].markAsDirty();
              this.validateForm.controls[key].updateValueAndValidity();
            }
          }
          this.message.create('success', `Creado exitosamente`);
          this.modalService.closeAll();
          this.manageForms.ngOnInit();
          this.router.navigate(['forms/manage-forms'])
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
        if(this.codes.includes(control.value)){
          observer.next({ error: true, duplicated: true });
        }else{
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  constructor(private fb: FormBuilder,
    private formService: FormService,
    private modalService: NzModalService,
    private router: Router,
    private manageForms: ManageFormsComponent,
    private message: NzMessageService) {

    this.validateForm = this.fb.group({
      code: ['', [Validators.required], [this.codeAsyncValidator]],
      name: ['', [Validators.required]],
    });
  }
}
