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
import { masterData, masterDataModule } from '../../../core/interface/masterResponse.interface';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {

  @Input() rows: any[] = [];
  @Input() columns: any[] = [];
  @Input() dataTable: 'projects' | 'modules' | 'employees' = 'projects';
  @Output() projectName?: string;
  @Output() detailClick: EventEmitter<masterData> = new EventEmitter<masterData>();
  //@ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef, private apiservice: ApiService) { }

  ngAfterViewInit(): void {
      this.cdr.detectChanges();
      //this.table.recalculate();
  }


  ngOnInit(): void {
    if (this.dataTable === 'projects') {
      this.getProjectsFromApi(); 
    } else if (this.projectName && this.dataTable === 'modules') {
      console.warn('projectName is required for modules or employees data!');
    }
  }


  status(value: number): string {
    return value === 1 ? 'Go A Live' : 'Working';
  }  
  
  getProjectsFromApi(): void {
    this.apiservice.getApi<masterData[]>('GetAllProjects').subscribe({
      next: (res: ApiResponse<masterData[]>) => {
        if (res.status === 'success') {
          // Assuming res.data contains an array of projects
          this.rows = res.data.map(p => {
            // Process the project details
            const projectDetails = {
              ...p,
              ProjectStart: new Date(p.ProjectStart),
              ProjectEnd: new Date(p.ProjectEnd),
              //cost: this.calTotalCost(p),
            };
  
            // Map modules within the project
            const modules = p.Modules.map(m => ({
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
 
  
  findmanday(module: rModule): number {
    const start = new Date(module.ModuleAddDate);
    const due = new Date(module.ModuleDueDate);
    const diffTime = Math.abs(due.getTime() - start.getTime());
    const mandays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return mandays;
  }

  

  onDetailClick(row: masterData | masterDataModule): void {
    if (row && (row as masterData).ProjectName) {
        this.router.navigate([`/projects/${(row as masterData).ProjectName}`]);
    }

    if (row && (row as masterDataModule).ModuleName) {
        console.log((row as masterDataModule).ModuleName);
    }
}


  
  
}
