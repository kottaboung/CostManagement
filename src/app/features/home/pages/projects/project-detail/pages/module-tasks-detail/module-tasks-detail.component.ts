import { Component, OnInit } from '@angular/core';
import { Module } from '../../../../../mockup-interface';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { rModule } from '../../../../../../../core/interface/dataresponse.interface';
import { ApiService } from '../../../../../../../shared/services/api.service';
import { master } from '../../../../../../../core/interface/masterResponse.interface';

@Component({
  selector: 'app-module-tasks-detail',
  templateUrl: './module-tasks-detail.component.html',
  styleUrl: './module-tasks-detail.component.scss'
})
export class ModuleTasksDetailComponent implements OnInit{

  projectName: string = '';
  public row: rModule[] = [];
  public columns: any[] = [
    { title: 'Module Name', prop: 'ModuleName', sortable: true, width: 400 },
    { title: 'Created Date', prop: 'ModuleAddDate', sortable: true, width: 250 },
    { title: 'Due Date', prop: 'ModuleDueDate', sortable: true, width: 250 },
    { title: 'Manday', prop: 'mandays', sortable: true, width: 200 },
    { title: 'Cost', prop: 'mCost', sortable: true, width: 300 },
    { title: 'Status', prop: 'ModuleActive', sortable: false, width: 200 },
  ];

  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private apiService: ApiService
    ) { }

  ngOnInit(): void {
    console.log(this.projectName);
    
    this.route.queryParams.subscribe(params => {
      this.projectName = params['project'];
      this.loadModule();
    });
  }

  loadModule(): void {
    // Call the API to get the project details
    this.apiService.getApi<{ status: string; message: string; data: master[] }>('getdetail').subscribe(res => {
      // Log the response to check its structure
      console.log('API Response:', res);

      // Check if res.data is an array
      if (!res.data || !Array.isArray(res.data)) {
        console.error('Invalid data format received from the API:', res.data);
        return;
      }

      // Log the projectName being searched
      console.log('Searching for project:', this.projectName);
      
      // Find the project by the given projectName
      const project = res.data.find(p => p.ProjectName === this.projectName);
      
      if (project && project.modules) { 
        // Check if project.modules is an array
        if (Array.isArray(project.modules)) {
          this.row = project.modules.map((module: rModule) => {     
            const ModuleAddDate = new Date(module.ModuleAddDate);
            const ModuleDueDate = new Date(module.ModuleDueDate);
            const mandays = this.calculateManDays(ModuleAddDate, ModuleDueDate);
            const mCost = this.calculateModuleCost(module);
            return {
              ...module,
              ModuleAddDate,
              ModuleDueDate,
              mandays,
              mCost
            };
          });
          console.log('Loaded modules:', this.row);
        } else {
          console.error('Project modules are not an array:', project.modules);
        }
      } else {
        console.warn(`Project with name '${this.projectName}' not found or has no modules.`);
        console.log('Available projects:', res.data.map(p => p.ProjectName)); // Log available project names
      }
    }, error => {
      console.error('An error occurred while fetching module details:', error);
    });
  }

  calculateManDays(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const mandays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return mandays;
  }

  calculateModuleCost(module: rModule): number {
    if (!module.Employees || module.Employees.length === 0) {
      return 0;
    }

    return module.Employees.reduce((total, employee) => {
      return total + (employee.EmployeeCost ?? 0);
    }, 0);
  }

  // loadModules(): void {
  //   this.http.get<{ name: string; modules: Module[] }[]>('../assets/mockdata/mockData.json').subscribe(data => {
  //     const project = data.find(p => p.name === this.projectName);
  //     if (project) {
  //       this.row = project.modules.map((module: Module) => {
  //         const addDate = new Date(module.addDate);
  //         const dueDate = new Date(module.dueDate);
  //         console.log('Add Date:', addDate);
  //         console.log('Due Date:', dueDate);
  //         return {
  //           ...module,
  //           addDate,
  //           dueDate
  //         };
  //       });
  //     }
  //   });
  // }
  
  
  
  
}
