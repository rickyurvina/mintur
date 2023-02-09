import { Component, OnInit } from '@angular/core';
import { Establishment } from 'src/app/test-form/establishment';
import { EstablishmentService } from 'src/app/test-form/establishment.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ShowEstablishmentComponent } from './show-establishment/show-establishment.component';
import pdfMake from 'pdfmake/build/pdfmake';
import * as XLSX from 'xlsx';
import { ResultsService } from 'src/app/test-form/results.service';
import { Result } from 'src/app/test-form/result';
@Component({
  selector: 'app-manage-establishments',
  templateUrl: './manage-establishments.component.html',
  styleUrls: ['./manage-establishments.component.css']
})
export class ManageEstablishmentsComponent implements OnInit {
  establishments: Establishment[] = [];

  components: any[];
  subTopics: any[];
  questionsChart:any[]=[]
  forms: any[];
  result: Result;
  results:Result[]=[];

  constructor(private establishmentService: EstablishmentService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private resultsService:ResultsService) { }

  ngOnInit(): void {
    try {
      this.establishmentService.getAll().subscribe((data: Establishment[]) => {
        this.establishments = data;
      }, err => {
        this.message.create('error', `Error: ${err}`);
      });
    } catch (e) {
      this.message.create('error', `Error ${e}`);
    }
  }

  showEstablishment(id) {
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

  async downloadPdf(id,action = 'download') {
    try {
        this.establishmentService.chargeResultsEstablishment(id).subscribe((data: Establishment) => {
          var establishment = data['establishment'];
          var form = data['forms'];
          var components = data['components'];
          var subTopics = data['subTopics'];
          var questions = data['questions'].filter(function (element) {
            if (element['resultable']!=null  && element['resultable']['type'] == 'relacionada') {
              if (element['score'] / 10 < 5) {
                return  element['resultable']['has_score']==1 &&  element['resultable']['code']!=null;
              }
            } else if (element['resultable']!=null  &&  element['resultable']['type'] == 'si_no') {
              if (element['score'] * 10 < 5) {
                return   element['resultable']['has_score']==1 &&  element['resultable']['code']!=null;
              }
            } else if (element['resultable']!=null  &&  element['resultable']['type'] == 'rango_1_5') {
              if (element['score'] * 5 < 5) {
                return  element['resultable']['has_score']==1 &&  element['resultable']['code']!=null;
              }
            }
          })
          let docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            pageMargins: [40, 60, 40, 60],
            header: {
              columns: [
                {
                  width: '*',
                  table: {
                    headerRows: 1,
                    body: [
                      [
                        {
                          text: form[0]['resultable']['name'],
                          alignment: 'center',
                        },
                      ],
                      [
                        { text: form[0]['resultable']['description'], bold: true },
                      ],
                    ],
                  }
                },
              ],
            },
            content: [
              {
                columns: [
                  {
                    text: `Fecha: ${new Date().toLocaleString()}\n`,
                    alignment: 'right',
                  },

                ],
              },
              {
                aligment: 'center',
                text: '  ',
              },
              {
                aligment: 'center',
                text: '  ',
              },
              {
                columns: [
                  {

                    table: {
                      headerRows: 1,
                      body: [
                        [
                          {
                            text: 'Detalles Establecimiento',
                            alignment: 'center',
                            fillColor: '#26506d',
                            color: 'white',
                            colSpan: 2,
                          },
                          {},
                        ],
                        [
                          { text: 'Nombre', bold: true },
                          {
                            text: establishment['name']
                          },
                        ],
                        [
                          { text: 'Correo', bold: true },
                          {
                            text: establishment['email']
                          },
                        ],
                        [
                          { text: 'Nombre establecimiento', bold: true },
                          {
                            text: establishment['company']
                          },
                        ],
                        [
                          { text: 'RUC', bold: true },
                          {
                            text: establishment['ruc']
                          },
                        ],
                        [
                          { text: 'Tipo', bold: true },
                          {
                            text: establishment['type_of_taxpayer']
                          },
                        ],
                        [
                          { text: 'Dirección', bold: true },
                          {
                            text: establishment['direction']
                          },
                        ],

                      ],
                    },
                  },

                  {
                    table: {
                      headerRows: 1,
                      widths: ['auto'],
                      body: [
                        [{ text: 'Visita tus resultados en linea', alignment: 'right' }],
                        [{ qr: `http://172.177.124.172/user/test-form`, fit: '100' }],
                      ],
                    },
                    alignment: 'right',
                    layout: 'noBorders',
                  },
                ],
              },
              {
                aligment: 'center',
                text: '  ',
              },

              {
                style: 'tableExample',
                table: {
                  layout: 'lightHorizontalLines',
                  headerRows: 1,
                  widths: ['auto', 'auto'],
                  body: [
                    [
                      {
                        text: 'Formulario',
                        alignment: 'center',
                        fillColor: '#26506d',
                        color: 'white',
                      },
                      {
                        text: 'Calificación',
                        alignment: 'center',
                        fillColor: '#26506d',
                        color: 'white',
                      },
                    ],
                    [
                      {
                        text: form[0]['resultable']['name'],
                        alignment: 'center',
                      },
                      {
                        text: (form[0]['score'] * 1).toFixed(2),
                        alignment: 'center',
                      },
                    ],

                  ],
                },
              },
              {
                aligment: 'center',
                text: '  ',
              },

              {
                style: 'tableExample',
                table: {
                  layout: 'lightHorizontalLines',
                  headerRows: 1,
                  widths: ['auto', 'auto'],
                  body: [
                    [
                      {
                        text: 'Componente',
                        alignment: 'center',
                        fillColor: '#26506d',
                        color: 'white',
                      },
                      {
                        text: 'Calificación',
                        alignment: 'center',
                        fillColor: '#26506d',
                        color: 'white',
                      },
                    ],
                    ...components.map((p) => [
                      p['resultable']['name'],
                      p['score'],
                    ]),

                  ],
                },
              },
              {
                aligment: 'center',
                text: '  ',
              },
              {
                style: 'tableExample',
                table: {
                  layout: 'lightHorizontalLines',
                  headerRows: 1,
                  widths: ['auto', 'auto'],
                  body: [
                    [
                      {
                        text: 'Sub Tema',
                        alignment: 'center',
                        fillColor: '#26506d',
                        color: 'white',
                      },
                      {
                        text: 'Calificación',
                        alignment: 'center',
                        fillColor: '#26506d',
                        color: 'white',
                      },
                    ],
                    ...subTopics.map((p) => [
                      p['resultable']['name'],
                      p['score'],
                    ]),

                  ],
                },
              },
              {
                aligment: 'center',
                text: '  ',
              },
              {
                style: 'tableExample',
                table: {
                  layout: 'lightHorizontalLines',
                  headerRows: 2,
                  widths: ['auto', 'auto', 'auto', 'auto'],
                  body: [
                    [
                      {
                        text: 'A CONTINUACIÓN SE MUESTRA LA IMPORTANCIA Y MEDIOS DE VERIFICACIÓN DE LAS PREGUNTAS CON BAJA CALIFICACIÓN',
                        alignment: 'center',
                        fillColor: '#26506d',
                        color: 'white',
                        colSpan: 4,
                      }, {}, {}, {}
                    ],
                    [
                      {
                        text: 'Pregunta',
                        alignment: 'center',
                        fillColor: '#26506d',
                        color: 'white',
                      },
                      {
                        text: 'Importancia',
                        alignment: 'center',
                        fillColor: '#26506d',
                        color: 'white',
                      },
                      {
                        text: 'Medios de verificación',
                        alignment: 'center',
                        fillColor: '#26506d',
                        color: 'white',
                      },
                      {
                        text: 'Calificación',
                        alignment: 'center',
                        fillColor: '#26506d',
                        color: 'white',
                      },
                    ],
                    ...questions.map((p) => [
                      p['resultable']['name'],
                      p['resultable']['importance'],
                      p['resultable']['verification_means'],
                      p['resultable']['type'] == 'relacionada' ? (p['score'] / 10).toFixed(2) : p['resultable']['type'] == 'si_no' ? (p['score'] * 10).toFixed(2) : (p['score'] * 5).toFixed(2)
                    ]),
                  ],
                },
              },
            ],
            styles: {
              table: {
                bold: true,
                fontSize: 10,
                alignment: 'center',
                decorationColor: 'red',
              },
              sectionHeader: {
                bold: true,
                decoration: 'underline',
                fontSize: 14,
                margin: [0, 15, 0, 15],
              },
              header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10],
              },
              subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5],
              },
              tableExample: {
                margin: [0, 5, 0, 15],
              },
              tableOpacityExample: {
                margin: [0, 5, 0, 15],
                fillColor: 'blue',
                fillOpacity: 0.3,
              },
              tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'red',
                background: 'black',
              },
            },
          };
          if (action === 'download') {
            pdfMake.createPdf(docDefinition).download(`Evaluacion${establishment['name']}.pdf`);
          }
        }, err => {
          this.message.create('error', `Error: al cargar la data para la descarga`);
        });
    } catch (e) {
      this.message.create('error', `Error: al descargar`);
    }
  }

  downloadExcel() {
    try{
      var data = [];
      // data.push(['Nombre', 'Correo', 'Empresa','Tipo','Año de Inicio de Operaciones','Calificación']);
      this.establishments.forEach(function(item){
        data.push([
          item.name,
          item.email,
          item.company,
          item['establishment_type']?item['establishment_type']['name']:'',
          item['start_year_operations'],
          item['results'].length>0?item['results'][0]['score']:'N/A'
        ])
      })

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

      const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      worksheet['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
      worksheet['!rows'] = [{ hpt: 30 }];
      worksheet['A1'] = { v: 'Nombre', s: { font: { bold: true }, fill: { fgColor: { rgb: '#26506d' } }, alignment: { horizontal: 'center' } } };
      worksheet['B1'] = { v: 'Correo', s: { font: { bold: true }, fill: { fgColor: { rgb: '#26506d' } }, alignment: { horizontal: 'center' } } };
      worksheet['C1'] = { v: 'Empresa', s: { font: { bold: true }, fill: { fgColor: { rgb: '#26506d' } }, alignment: { horizontal: 'center' } } };
      worksheet['D1'] = { v: 'Tipo', s: { font: { bold: true }, fill: { fgColor: { rgb: '#26506d' } }, alignment: { horizontal: 'center' } } };
      worksheet['E1'] = { v: 'Año de Inicio de Operaciones', s: { font: { bold: true }, fill: { fgColor: { rgb: '#26506d' } }, alignment: { horizontal: 'center' } } };
      worksheet['F1'] = { v: 'Calificación', s: { font: { bold: true }, fill: { fgColor: { rgb: '#26506d' } }, alignment: { horizontal: 'center' } } };

      XLSX.writeFile(workbook, 'resultados_establecimientos.xlsx');
    }catch(e){
      this.message.create('error', `Error: al descargar el archivo excel`);
    }
  }

  downloadExcelResults() {
    try{
      // data.push(['Nombre', 'Correo', 'Empresa','Tipo','Año de Inicio de Operaciones','Calificación']);
      try {
        this.resultsService.getAll().subscribe((data: Result[]) => {
          var dataArr = [];

          this.results = data;
          this.results.forEach(function(item){
            var score;
            if( item['resultable_type']=="App\\Models\\Forms\\Question"){
              if(item['resultable']['type'] == 'relacionada' || item['resultable']['type'] == 'una_opcion'){
                score= (item['score'] / 10).toFixed(2)
               }else if( item['resultable']['type'] == 'si_no'){
                 score= (item['score'] * 10).toFixed(2)
               }else if(item['resultable']['type'] == 'informativa'){
                 score= (item['score'] / 10).toFixed(2)
               }else{
                 score=item['score']
               }
            }else{
              score=item['score']
            }

            dataArr.push([
              item.establishment.ruc,
              item.establishment.name,
              item.establishment.company,
              item.establishment.type_of_taxpayer,
              item.establishment.start_year_operations,
              item.establishment.register_number,
              item.establishment['establishment_type']['name'],
              item.establishment['province_location']['description'],
              item.establishment['canton_location']['description'],
              item.establishment['location_parrish']['description'],
              item['resultable_type']=="App\\Models\\Forms\\Question"?"Pregunta":
              item['resultable_type']=="App\\Models\\Forms\\Form"?"Formulario":
              item['resultable_type']=="App\\Models\\Forms\\Component"?"Componente":"SubTema",
              item['resultable']?  item['resultable']['code']:'',
              item['resultable']?  item['resultable']['name']:'',
              score,
              item.answer,
            ])
          })

          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataArr);

          const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

          XLSX.writeFile(workbook, 'resultados_establecimientos.xlsx');
        }, err => {
          this.message.create('error', `Error: ${err}`);
        });
      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }

    }catch(e){
      this.message.create('error', `Error: al descargar el archivo excel`);
    }
  }

  downloadExcelResults2() {
    try{
      try {
        this.establishmentService.getAllForExcel().subscribe((data: Establishment[]) => {
          var dataArr = [];

          this.establishments = data;
          console.log(data)
          this.establishments.forEach(function(item, index){
            var typeE;
            if( item['resultable_type']=="App\\Models\\Forms\\Question"){
              typeE="Pregunta"
            }else if(item['resultable_type']=="App\\Models\\Forms\\Form"){
              typeE="Formulario"
            }else if(item['resultable_type']=="App\\Models\\Forms\\SubTopic"){
              typeE="Ambito"
            }else{
              typeE="Componente"
            }
            dataArr.push([
              item.ruc,
              item.name,
              item.company,
              item.type_of_taxpayer,
              item.start_year_operations,
              item.register_number? item.register_number:'No posee registro',
              item['province_location']['description'],
              item['canton_location']['description'],
              item['location_parrish']['description'],
            ])

            item.results.forEach(function(result){
              var score;
              if( result.resultable_type=="App\\Models\\Forms\\Question"){
                if(result['resultable']['type'] == 'relacionada' || result['resultable']['type'] == 'una_opcion'){
                  score= (result['score'] / 10).toFixed(2)
                 }else if( result['resultable']['type'] == 'si_no'){
                   score= (result['score'] * 10).toFixed(2)
                 }else if(result['resultable']['type'] == 'informativa'){
                   score= (result['score'] / 10).toFixed(2)
                 }else{
                   score=result['score']
                 }
              }else{
                score=result['score']
              }

              if( result.resultable_type=="App\\Models\\Forms\\Question"){
                dataArr[index].push(result.resultable.code)
              }else{
                dataArr[index].push(result.resultable.name)
              }
              if(result.answer){
                dataArr[index].push(result.answer)
              }else{
                dataArr[index].push(score)
              }
            })

          })
          const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataArr);
          const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

          XLSX.writeFile(workbook, 'resultados_establecimientos.xlsx');
        }, err => {
          this.message.create('error', `Error: ${err}`);
        });
      } catch (e) {
        this.message.create('error', `Error ${e}`);
      }

    }catch(e){
      this.message.create('error', `Error: al descargar el archivo excel`);
    }
  }
}
