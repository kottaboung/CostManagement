import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee, Projects } from '../../../../../mockup-interface';
import { HttpClient } from '@angular/common/http';
import { masterDataEmployee } from '../../../../../../../core/interface/masterResponse.interface';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit{

  public projectName: string = '';
  public employees: masterDataEmployee[]=[];

  constructor(private route: ActivatedRoute,private http:HttpClient) {}

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.projectName = params['project'];
        //this.loadData();
      })
  }

  // loadData() {
  //   this.http.get<Projects[]>('/assets/mockdata/mockData.json').subscribe((data) => {
  //     const project = data.find(p => p.name === this.projectName);
  //     if (project) {
  //       this.employees = project.modules.flatMap(module => module.employees);
  //     } else {
  //       this.employees = [];
  //     }
  //   })
  // }

}
