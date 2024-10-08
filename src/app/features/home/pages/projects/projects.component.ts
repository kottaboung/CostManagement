import { Component, Input, OnInit, Output } from '@angular/core';
import { Projects } from '../../mockup-interface';
import { LoadingService } from '../../../../shared/services/loading.service';
import { HttpClient } from '@angular/common/http';
import { calculateTotalCost } from '../../mockup-service';
import { ProjectService } from '../../../../shared/services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from '../../../../shared/modals/project-modal/project-modal.component';
import { ApiService } from '../../../../shared/services/api.service';
import { rModule, rProjects } from './../../../../core/interface/dataresponse.interface';
import { ApiResponse } from '../../../../core/interface/response.interface';
import { error } from 'console';
import { masterData } from '../../../../core/interface/masterResponse.interface';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  columns = [
    { title: 'Project Name', prop: 'ProjectName', sortable: true, width: 300 },
    { title: 'Cost', prop: 'cost' , sortable: true, width: 250 },
    { title: 'Created Date', prop: 'ProjectStart', sortable: true, width: 150 },
    { title: 'End Date', prop: 'ProjectEnd', sortable: true, width: 150 },
    { title: 'Status', prop: 'ProjectStatus', sortable: false, width: 200 },
    { title: 'Detail', prop: 'detail', sortable: false, width: 100 }
  ];
  
  rows: rProjects[] = []; // Ensure it's an empty array initially
  
  @Output() currentStep: number = 1;
  Project: masterData | null = null;
  projects: masterData[] = [];
  @Input() projectName: string = '';
  master: masterData[] =[];
  real_projects: rProjects[]=[];
  projectCost: number = 0;

  constructor(
    private loading: LoadingService, 
    private apiService: ApiService,
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
    console.log("Projects", this.projects , `data here ${this.projectName}`)
    // this.onloadProjects();
    // setTimeout(() => {
    //   this.loadProjects(); 
    //   this.loading.hideLoading();
    // }, 300);
    setTimeout(() => {
      this.loadProj();
      this.loading.hideLoading();
    }, 300);
  }

  // onloadProjects() {
  //   this.projectService.getProjects().subscribe((projects) => {
  //     this.projects = projects;
  //   });
  // }

//   loadProjects(): void {
//   this.http.get<Projects[]>('../assets/mockdata/mockData.json').subscribe(
//     (data) => {
//       console.log('Loaded projects data:', data); // Debugging line
//       this.projects = data.map(project => {
//         project.cost = calculateTotalCost(project);
//         return project;
//       });
//       this.rows = this.projects;
//       this.loading.hideLoading();
//     },
//     (error) => {
//       console.error('Error loading projects data:', error);
//       this.loading.hideLoading();
//     }
//   );
// }

loadProj() :void{
  this.apiService.getApi<masterData[]>('GetMasterData').subscribe({
    next:(res: ApiResponse<masterData[]>) => {
      if(res.status === 'sucess') {
        this.master = res.data;
        console.log('load proj',this.master)
        res.data.map((project) => {
          this.projectName = project.ProjectName
        })
      } else {
        console.error(res.message);
      }
    },
    error: (error) => {
      console.error('An error occurred:', error);
    },
  });
}

// getProject(): void {
//   this.apiService.getApi<rProjects[]>('getprojects').subscribe({
//     next: (res: ApiResponse<rProjects[]>) => {
//       if (res.status === 'success') {
//         //this.real_projects = res.data;
//         res.data.map((name) => {
//           //this.projectName = name.ProjectName
//         })
//       } else {
//         console.error(res.message);
//       }
//     },
//     error: (error) => {
//       console.error('An error occurred:', error);
//     },
//   });
// }

// addProject(): void {

// }

  onDetailClick(project: masterData): void {
    console.log(this.currentStep);
    
    if (project.ProjectName) {
      this.projectName = project.ProjectName;
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
