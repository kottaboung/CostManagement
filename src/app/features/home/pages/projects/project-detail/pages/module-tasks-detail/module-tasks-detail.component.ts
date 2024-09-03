import { Component, OnInit } from '@angular/core';
import { Module } from '../../../../../mockup-data';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-module-tasks-detail',
  templateUrl: './module-tasks-detail.component.html',
  styleUrl: './module-tasks-detail.component.scss'
})
export class ModuleTasksDetailComponent implements OnInit{

  projectName: string = '';
  public row: Module[] = [];
  public columns: any[] = [
    { title: 'Module Name', prop: 'moduleName', sortable: true, width: 400 },
    { title: 'Created Date', prop: 'addDate', sortable: true, width: 250 },
    { title: 'Due Date', prop: 'dueDate', sortable: true, width: 250 },
    { title: 'Manday', prop: 'manday', sortable: true, width: 200 },
    { title: 'Cost', prop: 'mCost', sortable: true, width: 300 },
    { title: 'Status', prop: 'active', sortable: false, width: 200 },
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectName = params['project'];
      this.loadModules();
    });
  }

  loadModules(): void {
    this.http.get<{ name: string; modules: Module[] }[]>('../assets/mockdata/mockData.json').subscribe(data => {
      const project = data.find(p => p.name === this.projectName);
      if (project) {
        this.row = project.modules.map((module: Module) => {
          const addDate = new Date(module.addDate);
          const dueDate = new Date(module.dueDate);
          console.log('Add Date:', addDate);
          console.log('Due Date:', dueDate);
          return {
            ...module,
            addDate,
            dueDate
          };
        });
      }
    });
  }
  
  
  
  
}
