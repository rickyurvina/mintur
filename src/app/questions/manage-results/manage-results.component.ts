import { Component, OnInit, AfterViewChecked, HostListener } from '@angular/core';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';
import * as echarts from 'echarts';
import { GeographichClassifierService } from 'src/app/services/geographich-classifier.service';
import { GeographichClassifier } from 'src/app/services/geographich-classifier';

@Component({
  selector: 'app-manage-results',
  templateUrl: './manage-results.component.html',
  styleUrls: ['./manage-results.component.css']
})
export class ManageResultsComponent implements OnInit, AfterViewChecked {
  @HostListener('window:resize', ['$event'])
  geographics:GeographichClassifier[];

  constructor(private colorConfig: ThemeConstantService,
    private geographicService: GeographichClassifierService) {
      geographicService.getAllProvinces().subscribe((data: GeographichClassifier[])=>{
        this.geographics=data;
      })
  }

  themeColors = this.colorConfig.get().colors;
  blue = this.themeColors.blue;
  blueLight = this.themeColors.blueLight;
  cyan = this.themeColors.cyan;
  cyanLight = this.themeColors.cyanLight;
  gold = this.themeColors.gold;
  purple = this.themeColors.purple;
  purpleLight = this.themeColors.purpleLight;
  red = this.themeColors.red;
  chartGeneral: any
  chartProvinces: any

  ngOnInit(): void {

  }

  ngAfterViewChecked() {
    this.showGeneralResults();
    this.showGeneralLocation();
  }

  showGeneralResults() {
    var dom = document.getElementById('generalResults');
    if(dom){
       this.chartGeneral = echarts.getInstanceByDom(dom);
      if (!this.chartGeneral ) {
        this.chartGeneral  = echarts.init(dom, null, {
          renderer: 'canvas',
          useDirtyRect: false
        });

        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'Direct',
              type: 'bar',
              emphasis: {
                focus: 'series'
              },
              data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
              name: 'Email',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: 'Union Ads',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: 'Video Ads',
              type: 'bar',
              stack: 'Ad',
              emphasis: {
                focus: 'series'
              },
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: 'Search Engine',
              type: 'bar',
              data: [862, 1018, 964, 1026, 1679, 1600, 1570],
              emphasis: {
                focus: 'series'
              },
              markLine: {
                lineStyle: {
                  type: 'dashed'
                },
                data: [[{ type: 'min' }, { type: 'max' }]]
              }
            },
            {
              name: 'Baidu',
              type: 'bar',
              barWidth: 5,
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [620, 732, 701, 734, 1090, 1130, 1120]
            },
            {
              name: 'Google',
              type: 'bar',
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [120, 132, 101, 134, 290, 230, 220]
            },
            {
              name: 'Bing',
              type: 'bar',
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [60, 72, 71, 74, 190, 130, 110]
            },
            {
              name: 'Others',
              type: 'bar',
              stack: 'Search Engine',
              emphasis: {
                focus: 'series'
              },
              data: [62, 82, 91, 84, 109, 110, 120]
            }
          ]
        };

        if (option && typeof option === 'object') {
          this.chartGeneral .setOption(option);
        }
      }
    }

  }

  showGeneralLocation() {
    var dom = document.getElementById('generalResultsLocation');
    if(dom){
       this.chartProvinces = echarts.getInstanceByDom(dom);
      if (!   this.chartProvinces) {
        this.chartProvinces = echarts.init(dom, null, {
          renderer: 'canvas',
          useDirtyRect: false
        });

        const data = this.genData(this.geographics.length);

        var option = {
          title: {
            text: 'Resultados por Provinicia',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: data.legendData
          },
          series: [
            {
              name: 'Nombre 1',
              type: 'pie',
              radius: '55%',
              center: ['40%', '50%'],
              data: data.seriesData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

        if (option && typeof option === 'object') {
          this.chartProvinces.setOption(option);
        }
      }
    }
  }

  genData(count: number) {
    // prettier-ignore
    const nameList = [];
    this.geographics.forEach(function(province){
      nameList.push(province.description)
    })
    const legendData = [];
    const seriesData = [];
    nameList.forEach(function(name){
      legendData.push(name);
      seriesData.push({
        name: name,
        value: Math.round(Math.random() * 100)
      });
    })
    return {
      legendData: legendData,
      seriesData: seriesData
    };
  }

  onResize(event) {
    this.chartGeneral.resize();
    this.chartProvinces.resize();
  }

}
