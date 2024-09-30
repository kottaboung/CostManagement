import { Component, OnInit, PLATFORM_ID, Inject, Output, EventEmitter, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EChartsOption } from 'echarts';
import { Module, Projects } from '../../../features/home/mockup-interface';
import { map, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MockService } from '../../services/mock-service.service';
import * as echarts from 'echarts';
import { ApiService } from '../../services/api.service';
import { rModule, rProjects } from '../../../core/interface/dataresponse.interface';
import { error } from 'console';
import { master } from '../../../core/interface/masterResponse.interface';

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
    private projectService: MockService,
    private apiService: ApiService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.currentYear = new Date().getFullYear(); // Default to current year
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.setUpYears();
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

  setUpYears(): void{
    this.apiService.getApi<rProjects[]>('getprojects').pipe(
      map(response => {
        if(response.status == 'success' && response.data) {
          return response.data.map(project => ({
            ...project,
            ProjectStart: new Date(project.ProjectStart)
          }));
        }
        return [];
      }),
      map(projects => new Set<number>(
        projects.map(project => project.ProjectStart.getFullYear())
      ))
    ).subscribe(yearsSet => {
      this.years = Array.from(yearsSet)
      .sort((a, b) => b-  a)
      .map(year => ({year, label: year.toString() }));

      this.currentYear = this.years[0]?.year || new Date().getFullYear();
      if(this.isBrowser) {
        this.initializeChart(this.currentYear);
      }
    }, error => {
      console.error('Error fetched projects', error);
    })
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

    this.apiService.getApi<master[]>('getdetail').pipe(
        map(response => {
            // Ensure the API response is successful
            if (response.status === 'success' && response.data) {
                return response.data.map(p => ({
                    ProjectID: p.ProjectID,
                    ProjectName: p.ProjectName,
                    ProjectStart: new Date(p.ProjectStart),
                    ProjectEnd: new Date(p.ProjectEnd),
                    ProjectStatus: p.ProjectStatus, 
                    employees: p.employees,
                    cost: this.calculateTotalCost(p),
                    modules: p.modules || [], // Include modules here (default to empty array if not present)
                }));
            }
            return []; // Return an empty array if not successful
        })
    ).subscribe(projects => {
        const filteredProjects: master[] = projects.filter(p => {
            const projectStartYear = (p.ProjectStart as Date).getFullYear();
            return projectStartYear === year || projectStartYear === year - 1;
        });

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
                        return `Total Cost: ${totalCost} THB<br>${month.projects.map(p => `${p.ProjectName}: ${p.cost || 0} THB`).join('<br>')}`;
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
    }, error => {
        console.error('Error fetching project details:', error);
    });
}


  calculateMandays(module: rModule): number {
    const startDate = new Date(module.ModuleAddDate);
    const dueDate = new Date(module.ModuleDueDate);
    const diffTime = Math.abs(dueDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  }

  calculateTotalCost(project: master): number {
    if (!project.modules) {
      console.error(`Project: ${project.ProjectName}, modules data is missing`);
      return 0;
    }
  
    const totalCost = project.modules.reduce((total, module) => {
      if (!module.Employees) {
        console.error(`Module: ${module.ModuleName}, employees data is missing`);
        return total;
      }
  
      const mandays = this.calculateMandays(module);
      const moduleCost = mandays * module.Employees.reduce((moduleTotal, employee) => {
        return moduleTotal + (employee.EmployeeCost || 0); // Assuming this is a number
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

  getMonthData(projects: master[], monthsInYear: string[]): { month: string, totalCost: number, projects: master[] }[] {
    const monthMap = new Map<string, { totalCost: number, projects: master[] }>();

    monthsInYear.forEach(month => {
      monthMap.set(month, { totalCost: 0, projects: [] });
    });

    projects.forEach(p => {
      const projectYear = p.ProjectStart.getFullYear();
      const projectMonthIndex = p.ProjectStart.getMonth();

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

    this.apiService.getApi<master[]>('getdetail').pipe(
      map(response => response.data.map(p => ({
        ...p,
        ProjectID: p.ProjectID,
            ProjectName: p.ProjectName,
            ProjectStart: new Date(p.ProjectStart), 
            ProjectEnd: new Date(p.ProjectEnd),     
            ProjectStatus: p.ProjectStatus,   
            employees: p.employees,
            cost: this.calculateTotalCost(p),
      }))),
      map(projects => {
        const monthInYear = this.getMonthsInYear(this.currentYear);
        const monthsData = this.getMonthData(projects, monthInYear);
        return monthsData.map(month => ({
          ...month,
          totalCost: month.projects.reduce((sum, p) => sum + (p.cost ?? 0), 0)
        }));
      }),
      take(1)
    ).subscribe(monthData => {
      const clickedMonthData = monthData.find(d => d.month === clickedMonth );
      if(clickedMonth) {
        this.chartItemClicked.emit(clickedMonth);
      }
    }, error => {
      console.error('Error :', error);
    })
  }

}
