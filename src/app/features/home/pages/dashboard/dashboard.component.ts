import { Component, OnInit, Output } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ChartDetailComponent } from '../../modals/chart-detail/chart-detail.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { title } from 'node:process';
import { master, MasterResponse } from '../../../../core/interface/masterResponse.interface';
import { ApiService } from '../../../../shared/services/api.service';
import { ApiResponse } from './../../../../core/interface/response.interface';
import { rEmployee } from './../../../../core/interface/dataresponse.interface';

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
  public projects?: master[]

  currentsIndex = 0;
  visibleCards = 3;

  private mockProjectsUrl = '/assets/mockdata/mockData.json';  // URL to JSON file

  constructor(
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  public cards = [
    { title: 'Total Projects', description: 'Description 1' },
    { title: 'Current Year Cost', description:  'cost...'},
    { title: 'Totol Cost', description:  'cost...'},
    { title: 'Lastest Project', description:  'Project...'}
    
  ]

  get maxIndex(): number {
    return Math.max(this.cards.length - this.visibleCards);
  }

  slideLeft() {
    if (this.currentsIndex >= 0) {
      this.currentsIndex--;
      // this.visibleCards++;
    }
  }

  slideRight() {
    if (this.currentsIndex < this.maxIndex) {
      this.currentsIndex++;
      // this.visibleCards--;
    }
  }

  ngOnInit() {
    this.loadingService.showLoading();
    this.isLoading = true;
    
    this.loadProjects().subscribe({
      next: (projects) => {
        this.updateChartData(this.selectedYear, projects);
        this.loadingService.hideLoading();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading projects', err);
        this.loadingService.hideLoading();
        this.isLoading = false;
      }
    });
  }
  
  loadProjects(): Observable<master[]> {
    return this.apiService.getApi<MasterResponse>('getdetail').pipe(
      map((response: ApiResponse<MasterResponse>) => {  // Correctly annotate as ApiResponse<MasterResponse>
        const projects = response.data;  // Access the data property
  
        if (Array.isArray(projects)) {
          return projects.map(p => ({
            ProjectID: p.ProjectID,
            ProjectName: p.ProjectName,
            ProjectStart: new Date(p.ProjectStart), // Convert to Date object
            ProjectEnd: new Date(p.ProjectEnd),     // Convert to Date object
            ProjectStatus: p.ProjectStatus,         // Already a number
            modules: p.modules || [],               // Default to empty array if no modules
            employees: p.employees ? p.employees.map((emp: rEmployee) => ({
              EmployeeID: emp.EmployeeID,
              EmployeeName: emp.EmployeeName,
              EmployeePosition: emp.EmployeePosition || '', // Default to empty string if null
              EmployeeCost: emp.EmployeeCost !== null ?? 0 // Handle null cost
            })) : [] // Default to empty array if no employees
          }));
        }
  
        // Return an empty array if projects is not an array
        return [];
      })
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
    this.loadProjects().subscribe(projects => this.updateChartData(year, projects));
  }
}
