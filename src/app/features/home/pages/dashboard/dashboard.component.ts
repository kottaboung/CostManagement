import { Component, Output } from '@angular/core';
import { Router } from 'express';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  @Output() public page: string = 'dashbaord';

}
