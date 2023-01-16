import { Component } from '@angular/core';

import { FormService } from '../form.service';
import { Form } from '../form';

@Component({
  selector: 'app-manage-forms',
  templateUrl: './manage-forms.component.html',
  styleUrls: ['./manage-forms.component.css']
})
export class ManageFormsComponent {
  forms: Form[]=[];

  constructor(public formService:FormService) { }

  ngOnInit(): void {
    this.formService.getAll().subscribe((data: Form[])=>{
      this.forms=data;
    })
  }

  // deleteForm(id){s
  //   this.formService.delete(id).subscribe(res => {
  //        this.forms = this.forms.filter(item => item.id !== id);
  //        console.log('Person deleted successfully!');
  //   })
  // }
}
