import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../../../../../mockup-data';
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit{

  public projectName: string = '';

  public rows: Employee[]=[];
  public columns:any[]=[
    { title: 'Employee Name' , prop: 'emName', sortable: true, width: 300},
    { title: 'Cost rate', prop: 'emCost', sortable: true, width: 300 }
  ]

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.projectName = params['project'];
      })
  }

}
