import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { masterDataEmployee } from '../../../../core/interface/masterResponse.interface';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  constructor(
    private router: Router
  ){

  }

  cards: masterDataEmployee[] = [
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0
    },
  ];

  OnSetting() {
    this.router.navigate(['about/setting'])
  }

}
