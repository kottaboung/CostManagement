import { Component, OnInit, PLATFORM_ID, Inject, Output, EventEmitter } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EChartsOption } from 'echarts';
import { FormGroup, FormControl } from '@angular/forms';
import { mockData, YearDetail } from '../../../features/home/mockup-date';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  chartOption: EChartsOption | null = null;
  isBrowser: boolean;
  formGroup: FormGroup;
  
  years = [
    { year: 2024, label: '2024' },
    { year: 2023, label: '2023' },
    // Add more years if needed
  ];

  @Output() chartItemClicked = new EventEmitter<any>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private loadingService: LoadingService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.formGroup = new FormGroup({
      year: new FormControl(2024) // Default year
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadingService.showLoading();
      this.initializeChart();
      this.formGroup.get('year')?.valueChanges.subscribe(() => {
        this.initializeChart(); // Update chart when year changes
        this.loadingService.hideLoading();
      });
    }
  }

  initializeChart(): void {
    const selectedYear = this.formGroup.get('year')?.value;
    const yearData = mockData.find(d => d.year === selectedYear);

    if (yearData) {
      this.chartOption = {
        xAxis: { type: 'category', data: yearData.details.map(d => d.month) },
        yAxis: { type: 'value' },
        series: [{
          data: yearData.details.map(d => d.projects.reduce((sum, p) => sum + p.cost, 0)),
          type: 'bar',
          itemStyle: { color: '#42A5F5' }
        }],
        tooltip: {
          formatter: (params: any) => {
            const monthData = yearData.details.find(d => d.month === params.name);
            return monthData ? monthData.projects.map(p => `${p.projectName}: ${p.cost}`).join('<br>') : '';
          },
          trigger: 'axis',
        }
      };
    }
  }

  onChartClick(event: any): void {
    const selectedYear = this.formGroup.get('year')?.value;
    const monthData = mockData.find(d => d.year === selectedYear)?.details.find(d => d.month === event.name);
    if (monthData) {
      this.chartItemClicked.emit(monthData);
    }
  }
}
