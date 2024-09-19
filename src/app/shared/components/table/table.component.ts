import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Module, Projects, Employee } from '../../../features/home/mockup-interface';
import { mock } from '../../../core/type/mockData';
import { catchError, map, Observable, of } from 'rxjs';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from '../../services/api.service';
import { rProjects } from '../../../core/interface/dataresponse.interface';
import { ApiResponse } from '../../../core/interface/response.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {

  @Input() mockData: mock | string = 'mockData';
  @Input() rows: any[] = [];
  @Input() columns: any[] = [];
  @Input() dataTable: 'projects' | 'modules' | 'employees' = 'projects';
  @Input() projectName?: string;
  @Output() detailClick: EventEmitter<rProjects> = new EventEmitter<rProjects>();
  //@ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef, private apiservice: ApiService) { }

  ngAfterViewInit(): void {
      this.cdr.detectChanges();
      //this.table.recalculate();
  }

  // ngOnInit(): void {
  //   if (!this.projectName && this.dataTable !== 'projects') {
  //     this.projectName = this.rows.length > 0 ? this.rows[0].name : undefined;
  //   }
  //   this.loadEvent().subscribe({
  //     next: (data) => {
  //       this.rows = data;
  //       console.log('Loaded rows:', this.rows);
  //     },
  //     error: (error) => {
  //       console.error('Error loading data:', error);
  //     }
  //   });
  // }

  ngOnInit(): void {
    if (this.dataTable === 'projects') {
      this.getProjectsFromApi(); 
    } else if (this.projectName) {
      this.loadDetailsFromApi();
    } else {
      console.warn('projectName is required for modules or employees data!');
    }
  }

  status(value: any): string {
    return value === 0 ? 'working' : 'Go alive';
  }  
  
  getProjectsFromApi(): void {
    this.apiservice.getApi<rProjects[]>('getprojects').subscribe({
      next: (res: ApiResponse<rProjects[]>) => {
        if (res.status === 'success') {
          this.rows = res.data.map(p => ({
            ...p,
            ProjectStart: new Date(p.ProjectStart),
            ProjectEnd: new Date(p.ProjectEnd)
          }));
          console.log('Loaded real projects:', this.rows);
        } else {
          console.error(res.message);
        }
      },
      error: (error) => {
        console.error('An error occurred while fetching projects:', error);
      }
    });
  }
  
  
  loadDetailsFromApi(): void {
    const apiUrl = this.dataTable === 'modules' ? 'getmodules' : 'getemployees';
    const params = { projectName: this.projectName }; // Your query params
  
    this.apiservice.getParamApi<any[]>(apiUrl, params).subscribe({
      next: (res: ApiResponse<any[]>) => {
        if (res.status === 'success') {
          if (this.dataTable === 'modules') {
            this.rows = res.data.map((module: Module) => {
              const manday = this.calculateMandays(module);
              return {
                ...module,
                addDate: new Date(module.addDate),
                dueDate: new Date(module.dueDate),
                manday: manday,
                mCost: this.calculateModuleCost(module, manday)
              };
            });
          } else if (this.dataTable === 'employees') {
            this.rows = res.data.map((employee: Employee) => ({
              ...employee
            }));
          }
          console.log(`Loaded ${this.dataTable} data:`, this.rows);
        } else {
          console.error(res.message);
        }
      },
      error: (error) => {
        console.error(`Error fetching ${this.dataTable} data:`, error);
      }
    });
  }
  
  
  calculateMandays(module: Module): number {
    const startDate = new Date(module.addDate);
    const dueDate = new Date(module.dueDate);
    const diffTime = Math.abs(dueDate.getTime() - startDate.getTime());
    const mandays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return mandays;
  }

  calculateModuleCost(module: Module, manday: number): number {
    const totalEmployeeCost = module.employees.reduce((sum, employee) => sum + employee.emCost, 0);
    return totalEmployeeCost * manday;
  }

  // getModulesForProject(data: any[]): Module[] {
  //   if (!this.projectName) {
  //     console.warn('projectName is undefined!');
  //     return [];
  //   }
  //   const project = data.find(p => p.name === this.projectName);
  //   if (!project) {
  //     console.warn(`Project with name ${this.projectName} not found!`);
  //     return [];
  //   }
  //   return project.modules || [];
  // }
  
  // getEmployeesForProject(data: any[]): Employee[] {
  //   if (!this.projectName) {
  //     console.warn('projectName is undefined!');
  //     return [];
  //   }
  //   const project = data.find(p => p.name === this.projectName);
  //   if (!project) {
  //     console.warn(`Project with name ${this.projectName} not found!`);
  //     return [];
  //   }
  //   return project.employees || [];
  // }
  

  onDetailClick(row: Projects): void {
    console.log('Row clicked:', row); // Debugging line
    
    if (row && row.name) {
      console.log('Navigating to:', `/projects/${row.name}`);
      this.router.navigate([`/projects/${row.name}`]);
    } else {
      console.error('Row or row name is undefined', row);
    }
  }
  
  
}
