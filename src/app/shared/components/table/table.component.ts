import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Projects, mockProjects } from '../../../features/home/mockup-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() rows: Projects[] = [];
  @Input() columns: any[] = [];

  @Output() detailClick: EventEmitter<Projects> = new EventEmitter<Projects>();

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.rows = mockProjects.map(project => ({
      ...project,
      detail: project // Pass the full project object to the detail column
    }));
  }

  onDetailClick(project: Projects): void {
    if (project && project.name) {
      this.router.navigate(['/home/projects', project.name]); // Navigate to detail view
    } else {
      console.error('Project is undefined or project name is empty');
    }
  }
}
