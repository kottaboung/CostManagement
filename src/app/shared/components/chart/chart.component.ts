import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { ApiService } from '../../../shared/services/api.service';
import { ApiResponse } from './../../../core/interface/response.interface';
import { ProjectDetail, YearlyData, MonthlyData } from '../../../core/interface/chartResponse.interface';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  private chartInstance!: echarts.ECharts;

  availableYears: number[] = []; 
  selectedYear: number = new Date().getFullYear();

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

  constructor(
    private apiService: ApiService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadData(); // Load initial data
  }

  ngAfterViewInit(): void {
    this.chartInstance = echarts.init(this.chartContainer.nativeElement); // Initialize chart instance
    this.updateChartForSelectedYear([], this.selectedYear); // Initialize with an empty array
    window.addEventListener('resize', this.onWindowResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize); // Clean up the resize listener
  }

  onWindowResize = (): void => {
    if (this.chartInstance) {
      this.chartInstance.resize(); // Resize the chart when the window size changes
    }
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
        const monthlyTotals = selectedYearData.chart.map(monthData => parseFloat(monthData.total) || 0);
        const monthlyLabels = selectedYearData.chart.map(monthData => monthData.month);

        // Prepare series for total cost
        const totalCostSeries: echarts.BarSeriesOption = {
            name: 'Total Cost',
            type: 'bar',
            data: monthlyTotals,
            emphasis: {
                focus: 'series'
            }
        };

        // Update the chart options
        this.mergeOptions = {
            ...this.options,
            xAxis: {
                type: 'category', // Specify x-axis type as category
                data: monthlyLabels // Use month names as x-axis data
            },
            series: [totalCostSeries],
            legend: {
                data: ['Total Cost']
            },
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    const month = monthlyLabels[params.dataIndex];
                    const totalCost = params.value;
                    const formattedCost = totalCost.toLocaleString('en-US');
                    return `<strong>${month}</strong><br>Total Cost: ${formattedCost} THB`;
                }
            }
        };

        // Apply the new options to the chart
        this.chartInstance.setOption(this.mergeOptions as any, { notMerge: false });

        // Remove any existing click event listeners to avoid multiple triggers
        this.chartInstance.off('click');

        // Add click event to display detailed information
        this.chartInstance.on('click', (params: any) => {
            const monthIndex = params.dataIndex;
            const monthDetails: ProjectDetail[] = selectedYearData.chart[monthIndex].detail;
            if (monthDetails.length > 0) {
                this.showDetailDialog(monthDetails, monthlyLabels[monthIndex]);
            }
        });
    } else {
        console.warn(`No data found for the selected year: ${selectedYear}`);
    }
}

  showDetailDialog(monthDetails: ProjectDetail[], monthName: string): void {
    const modalRef = this.modalService.openDetail(monthDetails, monthName);
  }
}

