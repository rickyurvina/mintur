import {
  Component, OnInit, ViewEncapsulation, ViewChild,
  AfterViewInit, ElementRef, ChangeDetectorRef
} from '@angular/core';
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
import { Question } from 'src/app/questions/manage-questions/question';
import * as echarts from 'echarts';

@Component({
  selector: 'app-fill-form',
  templateUrl: './fill-form.component.html',
  styleUrls: ['./fill-form.component.css']
})

export class FillFormComponent implements OnInit {
  display = false;
  dynamicContent = '';

  encapsulation: ViewEncapsulation.None
  establishmentForm: FormGroup;
  form: Form;
  emailEstablishment: string;
  establishment: Establishment;
  index = 0;
  disable = false;
  subTopic: SubTopic;
  offsetTop = 2;
  subTopics: SubTopic[] = [];
  listOfData: Question[] = [
    {
      id: 1,
      name: 'q1',
      code: '001',
      type: 'si_no',
      max_score: null,
      description: 'string',
      parent_id: null,
      value: null,
      children_type: null,
      children: null,
      dependent: null
    },
    {
      id: 1,
      name: 'q1',
      code: '001',
      type: 'si_no',
      max_score: null,
      description: 'string',
      parent_id: null,
      value: null,
      children_type: null,
      children: null,
      dependent: null
    },
    {
      id: 1,
      name: 'q1',
      code: '001',
      type: 'si_no',
      max_score: null,
      description: 'string',
      parent_id: null,
      value: null,
      children_type: null,
      children: null,
      dependent: null
    },
  ];
  selectedValue = null;
  /*variables para el velocimentro*/
  chart: any;
  percentage: string

  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    private formService: FormService,
    private translate: TranslateService,
    private establishmentService: EstablishmentService,
    private localStore: LocalService,
    private subTopicService: SubTopicService,
    private changeDetector: ChangeDetectorRef
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
    this.index = 0;
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
          this.percentage = this.establishment.percentage
        }, err => {
          this.message.create('error', `Error: ${err}`);
        });
      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }
    }

    try {
      this.subTopicService.getAll().subscribe((data: SubTopic[]) => {
        this.subTopics = data;
        this.subTopic = this.subTopics[0];
      }, err => {
        this.message.create('error', `Error: ${err}`);
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }

    /*logica para el velocimentro*/
    // Create the echarts instance


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
        this.establishmentForm.reset();
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

  resetForm(): void {
    this.localStore.removeData('email')
    this.establishment = null;
    this.emailEstablishment = '';
    this.establishmentForm.reset();
  }

  selectStep(id: number, index: number): void {
    this.index = index;
    this.subTopic = this.subTopics.find(element => element['id'] == id)
  }

  handleTabChange(event) {
    if (this.form.components[event]) {
      this.subTopic = this.subTopics.find(element => element['id'] == this.form.components[event]['sub_topics'][0]['id'])
    }
    this.index = 0;
    this.changeDetector.detectChanges();
    this.showFormChart();
    this.showComponentsChart();
    this.showSubTopicsChart();
  }

  showFormChart() {
    var dom = document.getElementById('chartForm');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    var option;

    option = {
      title: {
        text: 'Calificación del Formulario',
        left: 'center'
      },
      series: [

        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '75%'],
          radius: '90%',
          min: 0,
          max: 1,
          splitNumber: 8,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.33, '#FF6E76'],
                [0.66, '#FDDD60'],
                [1, '#7CFFB2']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'inherit'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'inherit',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'inherit',
              width: 5
            }
          },
          axisLabel: {
            color: '#464646',
            fontSize: 20,
            rotate: 'tangential',
            formatter: function (value) {
              return Math.round(value * 10) + '';
            },
          },
          title: {
            offsetCenter: [0, '-10%'],
            fontSize: 20
          },
          detail: {
            fontSize: 30,
            offsetCenter: [0, '-35%'],
            valueAnimation: true,
            formatter: function (value) {
              return Math.round(value * 10) + '';
            },
            color: 'inherit'
          },
          data: [
            {
              value: 0.9,
              name: 'Calificación'
            }
          ]
        }
      ]
    };

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }

  showComponentsChart() {
    var dom = document.getElementById('chartComponentsForm');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    var option = {
      title: {
        text: 'Calificaciones por Componente',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (value) {
          return value[0]['value'];
        }
      },
      xAxis: {
        type: 'category',
        data: this.form.components.map(element => element['name']),
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 10
      },
      series: [
        {
          data: [
            9.5,
            {
              value: 3,
              itemStyle: {
                color: '#a90000'
              }
            },
            7,
          ],

          type: 'bar',
          label: {
            show: true,
            position: 'inside'
          },
        }
      ]
    };

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }

  showSubTopicsChart() {
    var dom = document.getElementById('chartSubTopicsForm');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    var option = {
      title: {
        text: 'Calificaciones por Sub Temas',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      dataset: {
        source: [
          ['score', 'amount', 'product'],
          [8.9, 8.9, 'Matcha Latte'],
          [5.6, 5.6, 'Milk Tea'],
          [7.7, 7.7, 'Cheese Cocoa'],
          [8, 8, 'Cheese Brownie'],
          [7.2, 7.2, 'Matcha Cocoa'],
          [4.5, 4.5, 'Tea'],
          [9.5, 9.5, 'Orange Juice'],
          [3.3, 3.3, 'Lemon Juice'],
          [5.5, 5.5, 'Walnut Brownie']

        ]
      },
      grid: { containLabel: true },
      xAxis: { name: 'Calificación' },
      yAxis: { type: 'category' },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: 0,
        max: 10,
        text: ['Calificación alta', 'Calificación baja'],
        // Map the score column to color
        dimension: 0,
        inRange: {
          color: ['#FD665F', '#FFCE34', '#65B581']
        }
      },
      series: [
        {
          type: 'bar',
          encode: {
            // Map the "amount" column to X axis.
            x: 'amount',
            // Map the "product" column to Y axis
            y: 'product'
          },
          label: {
            show: true,
            position: 'inside'
          },
        }
      ]
    };


    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }

}
