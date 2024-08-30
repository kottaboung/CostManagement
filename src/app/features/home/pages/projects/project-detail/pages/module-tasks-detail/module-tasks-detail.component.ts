import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mockProjects, Module, Projects } from '../../../../../mockup-data';
import { title } from 'process';

@Component({
  selector: 'app-module-tasks-detail',
  templateUrl: './module-tasks-detail.component.html',
  styleUrl: './module-tasks-detail.component.scss'
})
export class ModuleTasksDetailComponent implements OnInit{

  projectName:string = ''

  public row: Module[] =[ ];
  public columns: any[]=[
    { title: 'Module Name', prop: 'moduleName', sortable: true, width: 300 },
    { title: 'Created Date', prop: 'addDate', sortable: true, width: 200 },
    { title: 'Due Date', prop: 'dueDate', sortable: true, width: 200 },
    { title: 'Manday', prop: 'manday', sortable: true, width: 150 },
    { title: 'Status', prop: 'active', sortable: false, width: 150 },
    
  ]

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectName = params['project'];
      
    });
  }

  
}
