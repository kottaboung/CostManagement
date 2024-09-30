import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Module, Projects, Employee } from '../../../features/home/mockup-interface';
import { mock } from '../../../core/type/mockData';
import { catchError, map, Observable, of } from 'rxjs';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from '../../services/api.service';
import { rModule, rProjects } from '../../../core/interface/dataresponse.interface';
import { ApiResponse } from '../../../core/interface/response.interface';
import { master } from '../../../core/interface/masterResponse.interface';

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
  @Output() projectName?: string;
  @Output() detailClick: EventEmitter<master> = new EventEmitter<master>();
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
    } else if (this.projectName && this.dataTable === 'modules') {
      console.warn('projectName is required for modules or employees data!');
    }
  }


  status(value: any): string {
    return value === 0 ? 'working' : 'Go alive';
  }  
  
  getProjectsFromApi(): void {
    this.apiservice.getApi<master[]>('getdetail').subscribe({
      next: (res: ApiResponse<master[]>) => {
        if (res.status === 'success') {
          // Assuming res.data contains an array of projects
          this.rows = res.data.map(p => {
            // Process the project details
            const projectDetails = {
              ...p,
              ProjectStart: new Date(p.ProjectStart),
              ProjectEnd: new Date(p.ProjectEnd),
              cost: this.calTotalCost(p),
            };
  
            // Map modules within the project
            const modules = p.modules.map(m => ({
              ...m,
              ModuleAddDate: new Date(m.ModuleAddDate),
              ModuleDueDate: new Date(m.ModuleDueDate),
            }));
  
            // Return combined project details and modules
            return {
              ...projectDetails,
              modules, // Add modules to the project
            };
          });
  
          console.log('Loaded real projects with modules:', this.rows);
        } else {
          console.error(res.message);
        }
      },
      error: (error) => {
        console.error('An error occurred while fetching projects:', error);
      }
    });
  }
  

  // loadModule(): void{
  //   this.apiservice.getApi<rModule[]>('GetAllModule').subscribe({
  //     next: (res: ApiResponse<rModule[]>) => {
  //       if(res.status === 'success') {
  //         this.rows = res.data.map(m => ({
  //           ...m,
  //           ModuleName: m.ModuleName,
  //           ModuleAddDate: new Date(m.ModuleAddDate),
  //           ModuleDueDate: new Date(m.ModuleDueDate),
  //           ModuleActive: m.ModuleActive
  //         }));
  //         console.log('Loaded module', this.rows);
  //       } else {
  //         console.error(res.message);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('error occured while fetching module', error);
  //     }
  //   })
  // }
  
  
  // loadDetailsFromApi(): void {
  //   const apiUrl = this.dataTable === 'modules' ? 'getmodules' : 'getemployees';
  //   const params = { projectName: this.projectName }; // Your query params
  
  //   this.apiservice.getParamApi<any[]>(apiUrl, params).subscribe({
  //     next: (res: ApiResponse<any[]>) => {
  //       if (res.status === 'success') {
  //         if (this.dataTable === 'modules') {
  //           this.rows = res.data.map((module: Module) => {
  //             const manday = this.calculateMandays(module);
  //             return {
  //               ...module,
  //               addDate: new Date(module.addDate),
  //               dueDate: new Date(module.dueDate),
  //               manday: manday,
  //               mCost: this.calculateModuleCost(module, manday)
  //             };
  //           });
  //         } else if (this.dataTable === 'employees') {
  //           this.rows = res.data.map((employee: Employee) => ({
  //             ...employee
  //           }));
  //         }
  //         console.log(`[Table Component]Loaded ${this.dataTable} data:`, this.rows);
  //       } else {
  //         console.error(res.message);
  //       }
  //     },
  //     error: (error) => {
  //       console.error(`Error fetching ${this.dataTable} data:`, error);
  //     }
  //   });
  // }
  
  
  calTotalCost(project: master): number {
    if(!project.modules || project.modules.length === 0) {
      return 0;
    }
    if(!project.employees || project.employees.length === 0) {
      return 0;
    }
    const moudleCost = project?.modules.reduce((total, module) => {
      const mandays = this.findmanday(module);
      const emCost = module?.Employees.reduce((moduleTotal, employee) => moduleTotal + employee.EmployeeCost, 0);
      return total + (emCost * mandays);
    }, 0);
  
    const employeeCosts = project.employees ? project.employees.reduce((total, employees) => total + employees.EmployeeCost, 0) :0;
    return moudleCost + employeeCosts;
  }
  
  findmanday(module: rModule): number {
    const start = new Date(module.ModuleAddDate);
    const due = new Date(module.ModuleDueDate);
    const diffTime = Math.abs(due.getTime() - start.getTime());
    const mandays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return mandays;
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
  

  onDetailClick(row: master): void {
    console.log('Row clicked:', row); // Debugging line
    
    if (row && row.ProjectName) {
      console.log('Navigating to:', `/projects/${row.ProjectName}`);
      this.router.navigate([`/projects/${row.ProjectName}`]);
    } else {
      console.error('Row or row name is undefined', row);
    }
  }
  
  
}
