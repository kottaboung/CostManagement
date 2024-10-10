import { Component, OnInit } from '@angular/core';
import { Module } from '../../../../../mockup-interface';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { rModule } from '../../../../../../../core/interface/dataresponse.interface';
import { ApiService } from '../../../../../../../shared/services/api.service';
import { masterData, masterDataModule, showModuleById } from '../../../../../../../core/interface/masterResponse.interface';

@Component({
  selector: 'app-module-tasks-detail',
  templateUrl: './module-tasks-detail.component.html',
  styleUrls: ['./module-tasks-detail.component.scss']
})
export class ModuleTasksDetailComponent implements OnInit{

  projectName: string = '';
  public row: masterDataModule[] = [];
  public columns: any[] = [
    { title: 'Module Name', prop: 'ModuleName', sortable: true, width: 400 },
    { title: 'Created Date', prop: 'ModuleAddDate', sortable: true, width: 250 },
    { title: 'Due Date', prop: 'ModuleDueDate', sortable: true, width: 250 },
    { title: 'Duration', prop: 'mandays', sortable: true, width: 200 },
    { title: 'button', prop: 'detail', sortable: false }
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectName = params['project'];
      this.loadModule();
    });
  }

  loadModule(): void {
    // Prepare the request body with the project name
    const requestBody = { ProjectName: this.projectName };

    // Call the API to get the module details
    this.apiService.postApi<showModuleById, { ProjectName: string }>('GetModuleById', requestBody).subscribe(res => {
      console.log('API Response:', res);

      // Check if the response data contains modules
      if (res.data && res.data.modules) {
        this.row = res.data.modules.map(module => ({
          ...module,
          mandays: this.calculateManDays(new Date(module.ModuleAddDate), new Date(module.ModuleDueDate))
        }));
      } else {
        console.error('Invalid data format received from the API:', res.data);
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

  calculateModuleCost(module: masterDataModule): number {
    if (!module.Employees || module.Employees.length === 0) {
      return 0;
    }

    return module.Employees.reduce((total, employee) => {
      return total + (employee.EmployeeCost ?? 0);
    }, 0);
  }
}
