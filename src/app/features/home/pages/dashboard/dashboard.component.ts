import { Component, OnInit, Output } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ChartDetailComponent } from '../../modals/chart-detail/chart-detail.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']  // Corrected the key here
})
export class DashboardComponent implements OnInit {
  @Output() public page: string = 'dashboard';  // Corrected the typo here
  currentIndex: number = 0;
  chartData: any;
  selectedYear: number = 2024;
  isLoading: boolean = false;

  private mockProjectsUrl = '/assets/mockdata/mockData.json';  // URL to JSON file

  constructor(
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadingService.showLoading();
    this.isLoading = true;
    this.loadMockProjects().subscribe(projects => {
      this.updateChartData(this.selectedYear, projects);
      this.loadingService.hideLoading();
      this.isLoading = false;
    });
  }

  loadMockProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.mockProjectsUrl).pipe(
      map(projects => projects.map(p => ({
        ...p,
        createdDate: new Date(p.createdDate)
      })))
    );
  }

  updateChartData(year: number, projects: any[]) {
    this.loadingService.showLoading();
    this.isLoading = true;
    const yearProjects = projects.filter(project => new Date(project.createdDate).getFullYear() === year);
    console.log('Year Projects:', yearProjects); // Debug line
    this.chartData = this.aggregateChartData(yearProjects);
    console.log('Chart Data:', this.chartData); // Debug line
    this.loadingService.hideLoading();
    this.isLoading = false;
  }

  aggregateChartData(projects: any[]): any {
    // Implement aggregation logic
    return projects.map(project => ({
      name: project.name,
      cost: project.cost // Implement your cost logic
    }));
  }

  onChartItemClicked(monthData: any): void {
    const dialogRef = this.dialog.open(ChartDetailComponent, { data: monthData });
    dialogRef.afterClosed().subscribe(() => {
      this.dialog.closeAll();
    });
  }

  changeYear(year: number) {
    this.selectedYear = year;
    this.loadMockProjects().subscribe(projects => this.updateChartData(year, projects));
  }
}
