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
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0, EmployeeImage: "/src/assets/icons/User.svg"
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0, EmployeeImage: "/src/assets/icons/User.svg"
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0, EmployeeImage: "/src/assets/icons/User.svg"
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0, EmployeeImage: "/src/assets/icons/User.svg"
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0, EmployeeImage: "/src/assets/icons/User.svg"
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0, EmployeeImage: "/src/assets/icons/User.svg"
    },
  ];

  OnSetting() {
    this.router.navigate(['about/setting'])
  }

}
