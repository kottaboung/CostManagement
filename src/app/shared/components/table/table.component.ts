import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Module, Projects, mockProjects } from '../../../features/home/mockup-data';
import { Router } from '@angular/router';
import { TableType } from '../../../core/type/table-type';
import { Employee } from './../../../features/home/mockup-data';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() rows: any[] = [];
  @Input() columns: any[] = [];
  @Input() dataTable:TableType = 'projects';
  @Input() projectName?: string;

  @Output() detailClick: EventEmitter<Projects> = new EventEmitter<Projects>();

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.dataTable === 'projects') {
      this.rows = mockProjects.map(project => ({
        ...project,
        createdDate: new Date(project.createdDate),
        detail: project
      }));
    } else if (this.dataTable === 'modules') {
      this.rows = this.getModulesForProject().map(module => ({
        ...module,
        addDate: new Date(module.addDate),
        dueDate: new Date(module.dueDate)
      }));
      
    } else if (this.dataTable === 'employees') {
      this.rows = this.getEmployeesForProject().map(Employee => ({
        ...Employee,
      }))
    }
    console.log(this.rows); // Debugging: Check the date fields
  }
  

  getModulesForProject(): Module[] {
    const project = mockProjects.find(p => p.name === this.projectName);
    return project ? project.modules : [];
  }

  getEmployeesForProject(): Employee[] {
    const project = mockProjects.find(p => p.name === this.projectName);
    return project ? project.employees : [];
  }

  onDetailClick(project: Projects): void {
    if (project && project.name) {
      this.router.navigate(['/home/projects', project.name]); // Navigate to detail view
    } else {
      console.error('Project is undefined or project name is empty');
    }
  }
}
