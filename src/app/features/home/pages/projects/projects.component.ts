import { Component, OnInit, Output } from '@angular/core';
import { Projects } from '../../mockup-interface';
import { LoadingService } from '../../../../shared/services/loading.service';
import { HttpClient } from '@angular/common/http';
import { calculateTotalCost } from '../../mockup-service';
import { ProjectService } from '../../../../shared/services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from '../../../../shared/modals/project-modal/project-modal.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  columns = [
    { title: 'Project Name', prop: 'name', sortable: true, width: 300 },
    { title: 'Cost', prop: 'cost', sortable: true, width: 300 },
    { title: 'Created Date', prop: 'createdDate', sortable: true, width: 300 },
    { title: 'Status', prop: 'status', sortable: false, width: 200 },
    { title: 'Detail', prop: 'detail', sortable: false, width: 100 }
  ];
  
  rows: Projects[] = []; // Ensure it's an empty array initially
  
  @Output() currentStep: number = 1;
  Project: Projects | null = null;
  projects: Projects[] = [];
  projectName: string = '';

  constructor(
    private loading: LoadingService, 
    private http: HttpClient, 
    private projectService: ProjectService, 
    private dialog: MatDialog) {
    
  }

  openCreateProjectModal() {
    const dialogRef = this.dialog.open(ProjectModalComponent, {
      
    });

    dialogRef.componentInstance.projectCreated.subscribe((newProject: any) => {
      this.projectService.createProject(newProject).subscribe((project) => {
        this.projects.push(project);
      });
    });
  }

  ngOnInit(): void {
    this.loading.showLoading();
    this.onloadProjects();
    setTimeout(() => {
      this.loadProjects(); 
      this.loading.hideLoading();
    }, 300);
    
  }

  onloadProjects() {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
    });
  }

  loadProjects(): void {
  this.http.get<Projects[]>('../assets/mockdata/mockData.json').subscribe(
    (data) => {
      console.log('Loaded projects data:', data); // Debugging line
      this.projects = data.map(project => {
        project.cost = calculateTotalCost(project);
        return project;
      });
      this.rows = this.projects;
      this.loading.hideLoading();
    },
    (error) => {
      console.error('Error loading projects data:', error);
      this.loading.hideLoading();
    }
  );
}


  onDetailClick(project: Projects): void {
    console.log(this.currentStep);
    
    if (project && project.name) {
      this.projectName = project.name;
      this.Project = project
      this.currentStep = 2; 
    } else {
      console.error('Project or project name is undefined');
    }
  }

  onBackToProjects(): void {
    this.Project = null;
    this.currentStep = 1; 
  }
}
