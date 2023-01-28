import {
  Component, OnInit, ChangeDetectorRef
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
import { Component as Comp } from 'src/app/questions/manage-components/component';
import { EstablishmentType } from '../establishment-type';
import { EstablishmentTypeService } from '../establishment-type.service';
import { ResultsService } from '../results.service';
import { GeographichClassifierService } from 'src/app/services/geographich-classifier.service';
import { GeographichClassifier } from 'src/app/services/geographich-classifier';

@Component({
  selector: 'app-fill-form',
  templateUrl: './fill-form.component.html',
  styleUrls: ['./fill-form.component.css']
})

export class FillFormComponent implements OnInit {

  establishmentForm: FormGroup;
  establishmentFormUpdate: FormGroup;
  form: Form;
  formDisplay: Form;
  emailEstablishment: string;
  establishment: Establishment;
  index = 0;
  subTopic: SubTopic;
  subTopics: SubTopic[] = [];
  subTopicsSteps: SubTopic[] = [];
  subTopicsCharts: SubTopic[] = [];
  components: Comp[] = [];
  questions: Question[] = [];
  questionsSteps: Question[] = [];
  establishmentTypes: EstablishmentType[] = [];
  provinces: GeographichClassifier[] = [];
  cantons: GeographichClassifier[] = [];
  cantonsShow: GeographichClassifier[] = [];
  parrishes: GeographichClassifier[] = [];
  parrishesShow: GeographichClassifier[] = [];
  listOfData: any[] = [
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
      dependent: null,
      establishment_type: null
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
      dependent: null,
      establishment_type: null

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
      dependent: null,
      establishment_type: null

    },
  ];

  percentage: string
  validateForm: FormGroup;
  years: any[] = [];

  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    private formService: FormService,
    private translate: TranslateService,
    private establishmentService: EstablishmentService,
    private localStore: LocalService,
    private subTopicService: SubTopicService,
    private changeDetector: ChangeDetectorRef,
    private establishmentTypeService: EstablishmentTypeService,
    public resultsService: ResultsService,
    private geographicClassifierService: GeographichClassifierService
  ) {
    this.establishmentForm = this.fb.group({
      name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],

    });

    this.establishmentFormUpdate = this.fb.group({
      ruc: ['', [Validators.required]],
      establishmentType: ['', [Validators.required]],
      typeOfTaxpayer: ['', [Validators.required]],
      province: ['', [Validators.required]],
      canton: ['', [Validators.required]],
      parrish: ['', [Validators.required]],
      direction: ['', [Validators.required]],
      startYearOperations: ['', [Validators.required]],
    });

    translate.addLangs(['es', 'en']);
    translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    this.index = 0;
    /*get establishment types*/
    try {
      this.establishmentTypeService.getAll().subscribe((data: EstablishmentType[]) => {
        this.establishmentTypes = data;
      }, err => {
        this.message.create('error', `Error: ${err}`);
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }

    this.formService.showActiveForm().subscribe((data: Form) => {
      this.formDisplay = data;
    }, err => {
      this.message.create('error', `Error: ${err}`);
    });

    if (this.localStore.getData('email')) {
      try {
        this.emailEstablishment = this.localStore.getData('email');
        this.establishmentService.showActiveEstablishmentForm(this.emailEstablishment).subscribe((data: Establishment) => {
          this.establishment = data;
          if (this.establishment.province) {
            this.chargeData();
          }
        }, err => {
          this.message.create('error', `Error: ${err}`);
        });
      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }
    }

    this.validateForm = this.fb.group({
      score: ['', []],
      type: ['', []],
      model: ['', []],
      establishment: ['', []],
      ids: ['', []]
    });

    try {
      this.geographicClassifierService.getAll().subscribe((data: GeographichClassifier[]) => {
        this.provinces = data.filter(element => element['type'] == 'PROVINCE');
        this.cantons = data.filter(element => element['type'] == 'CANTON');
        this.parrishes = data.filter(element => element['type'] == 'PARISH');

      }, err => {
        this.message.create('error', `Error: ${err}`);
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }

    const currentYear = new Date().getFullYear();
    const startYear = 1940;
    this.years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

  }

  submitForm(value: { name: string; email: string; company: string }): void {
    if (this.formDisplay.name) {
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
    } else {
      this.message.create('error', "No se puede iniciar, No existe un formulario acitvo")
    }
  }

  updateForm(value: { ruc: string; establishmentType: string; typeOfTaxpayer: string; province: string; canton: string; parrish: string; direction: string, startYearOperations: string }): void {

    if (this.formDisplay.name) {
      try {
        this.establishmentService.update(this.establishment.id, value).subscribe(res => {
          for (const key in this.establishmentFormUpdate.controls) {
            if (this.establishmentForm.controls.hasOwnProperty(key)) {
              this.establishmentForm.controls[key].markAsDirty();
              this.establishmentForm.controls[key].updateValueAndValidity();
            }
          }
          this.message.create('success', this.translate.instant('mensajes.creado_exitosamente'));
          this.establishmentFormUpdate.reset();
          this.chargeData();
        }, err => {
          this.showErrors(err)
        });
      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }
    } else {
      this.message.create('error', "No se puede iniciar, No existe un formulario acitvo")
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

  onChange(idQuestion: number, answer: string, value: any, type: string): void {

    if (type === 'relacionada') {
      try {
        this.validateForm.setValue({
          score: 1,
          type: 'relacionada',
          model: "App\\Models\\Forms\\Question",
          establishment: this.establishment.id,
          ids: value
        })

        this.resultsService.update(idQuestion, this.validateForm.value).subscribe(res => {
        }, err => {
          this.showErrors(err)
        });

      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }
    }

    if (type === 'si_no') {
      try {
        this.validateForm.setValue({
          score: answer == 'si' ? 1 : 0,
          type: 'si_no',
          model: "App\\Models\\Forms\\Question",
          establishment: this.establishment.id,
          ids: value
        })

        this.resultsService.update(idQuestion, this.validateForm.value).subscribe(res => {
          // this.message.create('success', this.translate.instant('mensajes.actualizado_exitosamente'));
        }, err => {
          this.showErrors(err)
        });

      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }
    }

    if (type === 'rango_1_5') {
      try {
        this.validateForm.setValue({
          score: answer,
          type: 'rango_1_5',
          model: "App\\Models\\Forms\\Question",
          establishment: this.establishment.id,
          ids: value
        })

        this.resultsService.update(idQuestion, this.validateForm.value).subscribe(res => {
          // this.message.create('success', this.translate.instant('mensajes.actualizado_exitosamente'));
        }, err => {
          this.showErrors(err)
        });

      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }
    }

    if (type === 'una_opcion') {
      try {
        this.validateForm.setValue({
          score: answer,
          type: 'una_opcion',
          model: "App\\Models\\Forms\\Question",
          establishment: this.establishment.id,
          ids: value
        })
        this.resultsService.update(idQuestion, this.validateForm.value).subscribe(res => {
        }, err => {
          this.showErrors(err)
        });

      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }
    }
  }

  resetForm(): void {
    this.localStore.removeData('email')
    this.establishment = null;
    this.emailEstablishment = '';
    this.establishmentForm.reset();
  }

  selectStep(id: number, index: number): void {
    this.index = index;
    this.subTopic = this.subTopics.find(element => element['resultable']['id'] == id)
    this.questionsSteps = this.questions.filter(function (element) {
      if (element['resultable']['sub_topics'].length > 0) {
        return element['resultable']['sub_topics'][0]['id'] == id
      }
    })

  }

  handleTabChange(event) {

    if (this.components[event]) {
      this.subTopic = this.subTopics.find(element => element['resultable']['component_id'] == this.components[event]['resultable']['id'])
      this.subTopicsSteps = this.subTopics.filter(element => element['resultable']['component_id'] == this.components[event]['resultable']['id']);

      var id = this.subTopic['resultable_id'];
      this.questionsSteps = this.questions.filter(function (element) {
        if (element['resultable']['sub_topics'].length > 0) {
          return element['resultable']['sub_topics'][0]['id'] == id
        }
      })
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

    var  option = {
        series: [
          {
            type: 'gauge',
            progress: {
              show: true,
              width: 18
            },
            axisLine: {
              lineStyle: {
                width: 18
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            axisLabel: {
              distance: 25,
              color: '#999',
              fontSize: 20
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 25,
              itemStyle: {
                borderWidth: 10
              }
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              fontSize: 80,
              offsetCenter: [0, '70%']
            },
            data: [
              {
                value: 70
              }
            ]
          }
        ]
    };



    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }

  showSubTopicsChart() {
    console.log(this.subTopicsCharts)
    var dom = document.getElementById('chartSubTopicsForm');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var data = [];
    data.push(['score', 'amount', 'product']);
    this.subTopicsCharts.forEach(function (item) {
      data.push([
        item['score'] ?? 0,
        item['score'] ?? 0,
        item['resultable']['name'],
      ]
      )
    })
    console.log(data)
    var option = {
      title: {
        text: 'Calificaciones por Sub Temas',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      dataset: {
        source:
          data
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

  updateCantons(value: any) {
    this.cantonsShow = this.cantons.filter(element => element['parent_id'] == value)
  }

  updateParrishes(value: any) {
    this.parrishesShow = this.parrishes.filter(element => element['parent_id'] == value)
  }

  chargeData() {
    try {
      this.emailEstablishment = this.localStore.getData('email');
      this.establishmentService.showActiveEstablishment(this.emailEstablishment).subscribe((data: Establishment) => {
        this.establishment = data;
        var form = this.establishment.results.find(element => element['resultable_type'] == "App\\Models\\Forms\\Form")
        this.form = form.resultable;
        var components = this.establishment.results.filter(element => element['resultable_type'] == "App\\Models\\Forms\\Component")
        this.components = components;

        var subTopics = this.establishment.results.filter(element => element['resultable_type'] == "App\\Models\\Forms\\SubTopic")
        this.subTopics = subTopics;

        this.subTopicsSteps = subTopics.filter(element => element.resultable['component_id'] == this.components[0]['resultable_id']);
        this.subTopic = subTopics[0];
        var questions = this.establishment.questions
        this.questions = questions;
        var subTo = this.subTopic['resultable_id']
        this.questionsSteps = this.questions.filter(function (element) {
          if (element['resultable']['sub_topics'].length > 0) {
            return element['resultable']['sub_topics'][0]['id'] == subTo
          }
        })

        this.percentage = this.establishment.percentage
      }, err => {
        this.message.create('error', `Error: ${err}`);
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }
  }

  handleTabChangeTabCharts(event) {

    if (this.components[event]) {
      this.subTopicsCharts = this.subTopics.filter(element => element['resultable']['component_id'] == this.components[event]['resultable']['id']);
    }
    this.index = 0;
    this.changeDetector.detectChanges();
    this.showSubTopicsChart();
  }

}
