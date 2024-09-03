import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Module, Projects, Employee } from '../../../features/home/mockup-data';
import { TableType } from '../../../core/type/table-type';
import { mock } from '../../../core/type/mockData';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() mockData: mock | string = 'mockData';
  @Input() rows: any[] = [];
  @Input() columns: any[] = [];
  @Input() dataTable: 'projects' | 'modules' | 'employees' = 'projects';
  @Input() projectName?: string;
  @Output() detailClick: EventEmitter<Projects> = new EventEmitter<Projects>();

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    if (!this.projectName && this.dataTable !== 'projects') {
      this.projectName = this.rows.length > 0 ? this.rows[0].name : undefined;
    }
    this.loadEvent().subscribe({
      next: (data) => {
        this.rows = data;
        console.log('Loaded rows:', this.rows);
      },
      error: (error) => {
        console.error('Error loading data:', error);
      }
    });
  }
  
  loadEvent(): Observable<any[]> {
    if (!this.mockData) {
      console.warn('No mockData provided!');
      return of([]);
    }
  
    const url = `assets/mockdata/${this.mockData}.json`;
  
    return this.http.get<any[]>(url).pipe(
      map((data) => {
        console.log('Data received:', data); // Debugging line
        if (this.dataTable === 'projects') {
          return data.map((project: Projects) => ({
            ...project,
            createdDate: new Date(project.createdDate),
            detail: project
          }));
        } else if (this.dataTable === 'modules') {
          return this.getModulesForProject(data).map((module: Module) => {
            const manday = this.calculateMandays(module);
            return {
              ...module,
              addDate: new Date(module.addDate),
              dueDate: new Date(module.dueDate),
              manday: manday,
              mCost: this.calculateModuleCost(module, manday) // Calculate mCost
            };
          });
        } else if (this.dataTable === 'employees') {
          return this.getEmployeesForProject(data).map((employee: Employee) => ({
            ...employee
          }));
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error loading data:', error);
        return of([]);
      })
    );
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

  getModulesForProject(data: any[]): Module[] {
    if (!this.projectName) {
      console.warn('projectName is undefined!');
      return [];
    }
    const project = data.find(p => p.name === this.projectName);
    if (!project) {
      console.warn(`Project with name ${this.projectName} not found!`);
      return [];
    }
    return project.modules || [];
  }
  
  getEmployeesForProject(data: any[]): Employee[] {
    if (!this.projectName) {
      console.warn('projectName is undefined!');
      return [];
    }
    const project = data.find(p => p.name === this.projectName);
    if (!project) {
      console.warn(`Project with name ${this.projectName} not found!`);
      return [];
    }
    return project.employees || [];
  }
  

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
