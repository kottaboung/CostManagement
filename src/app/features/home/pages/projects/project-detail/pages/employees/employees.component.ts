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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.projectName = params['project'];
      })
  }

}
