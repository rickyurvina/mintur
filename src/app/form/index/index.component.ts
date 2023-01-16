import { Component, OnInit } from '@angular/core';

import { FormService } from '../form.service';
import { Form } from '../form';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {

  forms: Form[]=[];

  constructor(public formService:FormService) { }

  ngOnInit(): void {
    this.formService.getAll().subscribe((data: Form[])=>{
      this.forms=data;
      console.log(this.forms);
    })
  }

  // deleteForm(id){s
  //   this.formService.delete(id).subscribe(res => {
  //        this.forms = this.forms.filter(item => item.id !== id);
  //        console.log('Person deleted successfully!');
  //   })
  // }

}
