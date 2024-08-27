import { Component, OnInit, PLATFORM_ID, Inject, Output, EventEmitter, output, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EChartsOption } from 'echarts';
import { mockProjects, Projects } from '../../../features/home/mockup-data';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  chartOption: EChartsOption | null = null;
  isBrowser: boolean;
  years: { year: number, label: string }[] = [];
  currentYear: number;

  @Input() isloading: boolean = false;
  
  @Output() chartItemClicked = new EventEmitter<any>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.currentYear = new Date().getFullYear(); // Default to current year
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.setupYears();
      this.initializeChart(this.currentYear);  // Initialize with the latest year
      this.setupRealTimeUpdates();  // Set up real-time updates
    }
  }

  setupYears(): void {
    const years = new Set<number>();
    mockProjects.forEach(project => {
      years.add(project.createdDate.getFullYear());
    });
    this.years = Array.from(years)
    .sort((a, b) => b - a)
    .map(year => ({ year, label: year.toString() }));

    this.currentYear = this.years[0].year;
  }

  onYearChange(event: Event): void {
    this.currentYear = parseInt((event.target as HTMLSelectElement).value, 10);
    this.initializeChart(this.currentYear);
  }

  initializeChart(year: number): void {
    const projects = mockProjects.filter(p => p.createdDate.getFullYear() <= year);
    const monthsInYear = this.getMonthsInYear(year);
    const monthData = this.getMonthData(projects, monthsInYear);

    this.chartOption = {
      xAxis: { type: 'category', data: monthsInYear },
      yAxis: { type: 'value' },
      series: [{
        data: monthData.map(d => d.totalCost),
        type: 'bar',
        itemStyle: { color: '#42A5F5' }
      }],
      tooltip: {
        formatter: (params: any) => {
          const month = monthData.find(d => d.month === params.name);
          return month ? `Total Cost: ${month.totalCost}<br>${month.projects.map(p => `${p.name}: ${p.cost}`).join('<br>')}` : '';
        },
        trigger: 'axis',
      }
    };
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
          monthData.totalCost += p.cost;
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

  getMonthNameIndex(monthName: string): number {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ].indexOf(monthName);
  }

  setupRealTimeUpdates(): void {
    // Example: Update the chart every 5 minutes
    setInterval(() => {
      this.initializeChart(this.currentYear);  // Refresh chart with the latest data
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
  }

  onChartClick(event: any): void {
    const monthData = this.getMonthData(mockProjects, this.getMonthsInYear(this.currentYear))
      .find(d => d.month === event.name);

    if (monthData) {
      this.chartItemClicked.emit(monthData);
    }
  }
}
