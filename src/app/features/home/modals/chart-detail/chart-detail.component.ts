import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Projects } from '../../mockup-data';
import { calculateTotalCost } from '../../mockup-service';

@Component({
  selector: 'app-chart-detail',
  templateUrl: './chart-detail.component.html',
  styleUrl: './chart-detail.component.scss'
})
export class ChartDetailComponent implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data: { month: string, totalCost: number, projects: Projects[] }) { }

  ngOnInit(): void {
    this.data.projects.map( projects => {
      const Cost = projects.cost = calculateTotalCost(projects)
    })
    
  }
}
