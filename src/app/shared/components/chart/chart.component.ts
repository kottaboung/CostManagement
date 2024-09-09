import { Component, OnInit, PLATFORM_ID, Inject, Output, EventEmitter, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EChartsOption } from 'echarts';
import { Module, Projects } from '../../../features/home/mockup-interface';
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

    if (this.chart) {
      this.chart.dispose();
    }

    this.chart = echarts.init(chartElement);

    this.projectService.getMockProjects().pipe(
      map(projects => projects.map(p => ({
        ...p,
        createdDate: typeof p.createdDate === 'string' ? new Date(p.createdDate) : p.createdDate,
        cost: p.cost || this.calculateTotalCost(p) // Use recalculated cost
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
          data: monthData.map(d => d.totalCost || 0),
          type: 'bar',
          itemStyle: { color: '#42A5F5' }
        }],
        tooltip: {
          formatter: (params: any) => {
            const month = monthData.find(d => d.month === params.name);
            if (month) {
              const totalCost = month.projects.reduce((sum, project) => sum + (project.cost || 0), 0);
              return `Total Cost: ${totalCost} THB<br>${month.projects.map(p => `${p.name}: ${p.cost || 0} THB`).join('<br>')}`;
            }
            return '';
          },
          trigger: 'axis',
        }
      };

      this.chart?.setOption(this.chartOption);
      this.chart?.on('click', (params) => {
        this.onChartClick(params);
      });
    });
  }

  calculateMandays(module: Module): number {
    const startDate = new Date(module.addDate);
    const dueDate = new Date(module.dueDate);
    const diffTime = Math.abs(dueDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  }

  calculateTotalCost(project: Projects): number {
    if (!project.modules) {
      console.error(`Project: ${project.name}, modules data is missing`);
      return 0;
    }

    const totalCost = project.modules.reduce((total, module) => {
      if (!module.employees) {
        console.error(`Module: ${module.moduleName}, employees data is missing`);
        return total;
      }

      const mandays = this.calculateMandays(module);
      const moduleCost = mandays * module.employees.reduce((moduleTotal, employee) => {
        return moduleTotal + (employee.emCost || 0);
      }, 0);

      return total + moduleCost;
    }, 0);

    return totalCost;
  }

  getMonthsInYear(year: number): string[] {
    const months: string[] = [];
    const isCurrentYear = year === new Date().getFullYear();
    const currentMonthIndex = isCurrentYear ? new Date().getMonth() : 11;

    for (let month = 0; month <= currentMonthIndex; month++) {
      months.push(this.getMonthName(month)); 
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

    monthsInYear.forEach(month => {
      monthMap.set(month, { totalCost: 0, projects: [] });
    });

    projects.forEach(p => {
      const projectYear = p.createdDate.getFullYear();
      const projectMonthIndex = p.createdDate.getMonth();

      monthsInYear.forEach((month, index) => {
        if (projectYear < this.currentYear || (projectYear === this.currentYear && index >= projectMonthIndex)) {
          const monthData = monthMap.get(month)!;
          monthData.totalCost += p.cost ?? 0;
          if (!monthData.projects.includes(p)) {
            monthData.projects.push(p);
          }
        }
      });
    });

    return Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      totalCost: data.totalCost,
      projects: data.projects
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
        createdDate: new Date(p.createdDate)
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
      }
    });
  }
}
