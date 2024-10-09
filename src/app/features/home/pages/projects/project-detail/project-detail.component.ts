import { Component, Input, OnInit } from '@angular/core';
import { Projects } from '../../../mockup-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { rModule, rProjects } from '../../../../../core/interface/dataresponse.interface';
import { ApiService } from '../../../../../shared/services/api.service';
import { reduce } from 'rxjs';
import { error } from 'console';
import { ApiResponse } from '../../../../../core/interface/response.interface';
import { masterData } from '../../../../../core/interface/masterResponse.interface';
import { calculateTotalCost } from './../../../mockup-service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  public project: masterData | undefined;
  @Input() currentStep = 2;
  public projectDetails: { label: string, value: string | number | any }[] = [];
  public page = 1;
  public pageName: string = "";
  public projectName: string | null = null;
  public projects?: masterData; 
  @Input() Project: masterData | null = null; 
  @Input() public active: boolean = true;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private http: HttpClient, 
    private apiService: ApiService) { }

  ngOnInit(): void {
    // Load project based on the route parameter
    this.route.paramMap.subscribe(params => {
      this.projectName = params.get('name');
      if (this.projectName) {
        this.loadProject();
      }
    });
  }

  loadProject(): void {
    if (!this.projectName) {
        console.error('Project name is not defined.');
        this.router.navigate(['/projects'], { queryParams: { error: 'not-found' } });
        return;
    }

    this.apiService.getApi<masterData[]>('GetAllProjects').subscribe({
        next: (response: ApiResponse<masterData[]>) => {
            const projects: masterData[] = response.data; 
            this.project = projects.find(p => p.ProjectName === this.projectName);

            if (this.project) {
                const startDate = this.formatDate(this.project.ProjectStart);
                
                this.projectDetails = [
                    { label: 'Name', value: this.project.ProjectName },
                    { label: 'ProjectCost', value: this.project.ProjectCost ? this.project.ProjectCost.toFixed(2) : 'N/A' }, // Changed here
                    { label: 'Created Date', value: startDate },
                    { label: 'Status', value: this.project.ProjectStatus === 1 ? 'Go A Live' : 'Working' }
                ];
                console.log(this.projectDetails);
            } else {
                console.error(`Project not found: ${this.projectName}`);
                this.router.navigate(['/projects'], { queryParams: { error: 'not-found' } });
            }
        },
        error: (error) => {
            console.error('Error loading project data', error);
            this.router.navigate(['/projects'], { queryParams: { error: 'loading-error' } });
        }
    });
}



findmanday(module: rModule): number{
  const start = new Date(module.ModuleAddDate);
  const due = new Date(module.ModuleDueDate);
  const diffTime = Math.abs(due.getTime() - start.getTime());
  const mandays = Math.ceil(diffTime / (1000 * 60 *60 /24));
  return mandays
}


  private formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onBackToProjects(): void {
    this.currentStep = 1; 
    this.router.navigate(['/projects']);
  }

  alert(value: number) {
    this.active = false;
    if (value === 1) {
      this.pageName = "Modules And Tasks";
    } else if (value === 2) {
      this.pageName = "Employees";
    }
  }
}
