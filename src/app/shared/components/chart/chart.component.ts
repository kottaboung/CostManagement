import { Component, OnInit, PLATFORM_ID, Inject, Output, EventEmitter, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EChartsOption } from 'echarts';
import { Projects } from '../../../features/home/mockup-data';
import { map, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MockService } from '../../services/mock-service.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  chart: echarts.ECharts | null = null;
  chartOption: EChartsOption | null = null;
  isBrowser: boolean;
  years: { year: number, label: string }[] = [];
  currentYear: number;

  @Input() isloading: boolean = false;
  @Output() chartItemClicked = new EventEmitter<any>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private projectService: MockService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.currentYear = new Date().getFullYear(); // Default to current year
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.setupYears();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Initialize the chart only after the view has fully initialized
      setTimeout(() => {
        this.initializeChart(this.currentYear);  // Initialize with the latest year
        this.setupRealTimeUpdates();  // Set up real-time updates
      }, 100); // Adjust the delay if needed
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }

  setupYears(): void {
    this.projectService.getMockProjects().pipe(
      map(projects => {
        return projects.map(project => ({
          ...project,
          createdDate: new Date(project.createdDate)
        }));
      }),
      map(projects => new Set<number>(
        projects.map(project => project.createdDate.getFullYear())
      ))
    ).subscribe(yearsSet => {
      this.years = Array.from(yearsSet)
        .sort((a, b) => b - a)
        .map(year => ({ year, label: year.toString() }));

      this.currentYear = this.years[0].year;
      if (this.isBrowser) {
        this.initializeChart(this.currentYear);
      }
    });
  }

  onYearChange(event: Event): void {
    this.currentYear = parseInt((event.target as HTMLSelectElement).value, 10);
    this.initializeChart(this.currentYear);
  }

  initializeChart(year: number): void {
    if (!this.isBrowser) return;
  
    const chartElement = document.getElementById('chart') as HTMLElement;
  
    if (!chartElement) {
      console.error('Chart DOM element not found');
      return;
    }
  
    // Dispose of existing chart instance if it exists
    if (this.chart) {
      this.chart.dispose();
    }
  
    this.chart = echarts.init(chartElement);
  
    this.projectService.getMockProjects().pipe(
      map(projects => projects.map(p => ({
        ...p,
        createdDate: typeof p.createdDate === 'string' ? new Date(p.createdDate) : p.createdDate,
        cost: p.cost || this.calculateTotalCost(p)  // Ensure cost is calculated if not provided
      })))
    ).subscribe(projects => {
      const filteredProjects = projects.filter(p => (p.createdDate as Date).getFullYear() === year || (p.createdDate as Date).getFullYear() === year - 1);
      const monthsInYear = this.getMonthsInYear(year);
      const monthData = this.getMonthData(filteredProjects, monthsInYear);
  
      this.chartOption = {
        xAxis: {
          type: 'category',
          data: monthsInYear
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: monthData.map(d => d.totalCost),
          type: 'bar',
          itemStyle: { color: '#42A5F5' }
        }],
        tooltip: {
          formatter: (params: any) => {
            const month = monthData.find(d => d.month === params.name);
            if (month) {
              // Calculate the total cost for the month
              const totalCost = month.projects.reduce((sum, project) => sum + (project.cost ?? 0), 0);
              return `Total Cost: ${totalCost}<br>${month.projects.map(p => `${p.name}: ${p.cost || 0}`).join('<br>')}`;
            }
            return '';
          },
          trigger: 'axis',
        }
      };
  
      // Set the chart option after initializing
      this.chart?.setOption(this.chartOption);
      this.chart?.on('click', (params) => {
        this.onChartClick(params);
      });
    });
  }
  
  calculateTotalCost(project: Projects): number {
    const moduleCosts = project.modules.reduce((total, module) => {
      return total + module.employees.reduce((moduleTotal, employee) => moduleTotal + employee.emCost, 0);
    }, 0);

    const employeeCosts = project.employees.reduce((total, employee) => total + employee.emCost, 0);

    const totalCost = moduleCosts + employeeCosts;
    console.log(`Project: ${project.name}, Total Cost: ${totalCost}`);
    return totalCost;
  }

  getMonthsInYear(year: number): string[] {
    const months: string[] = [];
    const isCurrentYear = year === new Date().getFullYear();
    const currentMonthIndex = isCurrentYear ? new Date().getMonth() : 11;

    for (let month = 0; month <= currentMonthIndex; month++) {
      months.push(this.getMonthName(month));  // Only push the month name
    }

    return months;
  }

  getMonthName(monthIndex: number): string {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ][monthIndex];
  }

  getMonthData(projects: Projects[], monthsInYear: string[]): { month: string, totalCost: number, projects: Projects[] }[] {
    const monthMap = new Map<string, { totalCost: number, projects: Projects[] }>();
  
    // Initialize monthMap with zero cost for all months
    monthsInYear.forEach(month => {
      monthMap.set(month, { totalCost: 0, projects: [] });
    });
  
    // Iterate through each project and update the costs for the months
    projects.forEach(p => {
      const projectYear = p.createdDate.getFullYear();
      const projectMonthIndex = p.createdDate.getMonth();
  
      // Start accumulating costs from the project's created month to the end of the year
      monthsInYear.forEach((month, index) => {
        if (projectYear < this.currentYear || (projectYear === this.currentYear && index >= projectMonthIndex)) {
          const monthData = monthMap.get(month)!;
          monthData.totalCost += p.cost ?? 0;  // Safeguard for undefined cost
          if (!monthData.projects.includes(p)) {
            monthData.projects.push(p);
          }
        }
      });
    });
  
    // Return the updated month data
    return monthsInYear.map(month => ({
      month,
      ...monthMap.get(month)!
    }));
  }
  
  

  setupRealTimeUpdates(): void {
    setInterval(() => {
      this.initializeChart(this.currentYear);
    }, 300000); // Refresh every 5 minutes
  }

  onChartClick(event: any): void {
    const clickedMonth = event.name;
  
    this.projectService.getMockProjects().pipe(
      map(projects => projects.map(p => ({
        ...p,
        createdDate: new Date(p.createdDate) // Ensure createdDate is a Date object
      }))),
      map(projects => {
        const monthsData = this.getMonthData(projects, this.getMonthsInYear(this.currentYear));
        return monthsData.map(month => ({
          ...month,
          totalCost: month.projects.reduce((sum, p) => sum + (p.cost ?? 0), 0) 
        }));
      }),
      take(1)
    ).subscribe(monthData => {
      const clickedMonthData = monthData.find(d => d.month === clickedMonth);
      if (clickedMonthData) {
        this.chartItemClicked.emit(clickedMonthData);
        console.log(clickedMonthData);
      }
    });
  }
  
  

  
}
