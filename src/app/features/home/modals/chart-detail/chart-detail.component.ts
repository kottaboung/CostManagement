import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-chart-detail',
  templateUrl: './chart-detail.component.html',
  styleUrl: './chart-detail.component.scss'
})
export class ChartDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
