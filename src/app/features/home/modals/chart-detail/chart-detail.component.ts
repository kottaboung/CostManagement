import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Projects } from '../../mockup-interface';
import { calculateTotalCost } from '../../mockup-service';
import { masterData } from '../../../../core/interface/masterResponse.interface';

@Component({
  selector: 'app-chart-detail',
  templateUrl: './chart-detail.component.html',
  styleUrl: './chart-detail.component.scss'
})
export class ChartDetailComponent { //implements OnInit{
  // constructor(@Inject(MAT_DIALOG_DATA) public data: { month: string, totalCost: number, projects: masterData[] }) { }

  // ngOnInit(): void {
  //   this.data.projects.map( projects => {
  //     const Cost = projects.ProjectCost = calculateTotalCost(projects)
  //   })
    
  // }
}
