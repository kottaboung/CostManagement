import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartsOption,  } from 'echarts';
import * as echarts from 'echarts';
import { ApiService } from '../../../shared/services/api.service';
import { ApiResponse } from './../../../core/interface/response.interface';
import { ProjectDetail, YearlyData } from '../../../core/interface/chartResponse.interface';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit {

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  private chartInstance!: echarts.ECharts;

  availableYears: number[] = []; // List of available years
  selectedYear: number = new Date().getFullYear(); // Default to the current year

  options: EChartsOption = {
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    },
    yAxis: { type: 'value' },
    series: [] // Series will be dynamically added based on project data
  };
  mergeOptions: EChartsOption | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData(); // Load initial data
  }

  ngAfterViewInit(): void {
    this.chartInstance = echarts.init(this.chartContainer.nativeElement); // Initialize chart instance
    this.updateChartForSelectedYear([], this.selectedYear); // Initialize with an empty array
  }

  // Load data and initialize the available years
  loadData(): void {
    this.apiService.getApi<YearlyData[]>('GetChartData').subscribe({
      next: (res: ApiResponse<YearlyData[]>) => {
        if (res.status === 'success') {
          this.initializeAvailableYears(res.data);
          this.updateChartForSelectedYear(res.data, this.selectedYear);
        }
      },
      error: (error) => {
        console.error('Failed to load data', error);
      }
    });
  }

  // Initialize available years from the API response
  initializeAvailableYears(data: YearlyData[]): void {
    this.availableYears = data.map(yearData => parseInt(yearData.year, 10));
  }

  onYearChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedYear = Number(selectedValue);

    this.clearChart(); // Clear the chart before fetching new data

    this.apiService.getApi<YearlyData[]>('GetChartData').subscribe({
      next: (res: ApiResponse<YearlyData[]>) => {
        if (res.status === 'success') {
          this.updateChartForSelectedYear(res.data, this.selectedYear);
        }
      },
      error: (error) => {
        console.error('Failed to load data', error);
      }
    });
  }

  clearChart(): void {
    this.options.series = []; // Clear the series in the options
    this.mergeOptions = null; // Reset mergeOptions
    this.chartInstance.clear(); // Clear the ECharts instance
  }

  updateChartForSelectedYear(data: YearlyData[], selectedYear: number): void {
    const selectedYearData = data.find(yearData => parseInt(yearData.year, 10) === selectedYear);

    if (selectedYearData) {
        const monthlyTotals = selectedYearData.chart.map(monthData => parseFloat(monthData.total));
        const monthDetails: ProjectDetail[][] = selectedYearData.chart.map(monthData => monthData.detail);

        const series: echarts.BarSeriesOption[] = [{
            name: `Total Costs for ${selectedYear}`,
            type: 'bar',
            data: monthlyTotals
        }];

        this.mergeOptions = {
            ...this.options,
            series: series,
            legend: {
                data: [`Total Costs for ${selectedYear}`],
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => { // Use 'any' temporarily for params
                    let tooltipHtml = '';
                    
                    if (Array.isArray(params)) {
                        params.forEach((param: any) => { // Use 'any' here as well
                            const monthIndex = param.dataIndex; // Get the index for the current month's data
                            const detail = monthDetails[monthIndex]; // Get the detail for this month

                            // Format the details
                            const detailList = detail.map((item) => `${item.ProjectName}: ${item.Cost}`).join('<br>');
                            tooltipHtml += `<strong>${param.name}</strong><br>${detailList}<br>`;
                        });
                    }
                    return tooltipHtml;
                },
                position: (pos: any) => { // Use 'any' here as well
                    return [pos[0], pos[1]];
                }
            }
        };

        this.chartInstance.setOption(this.mergeOptions as any, { notMerge: false });
    } else {
        console.warn(`No data found for the selected year: ${selectedYear}`);
    }
}

}
