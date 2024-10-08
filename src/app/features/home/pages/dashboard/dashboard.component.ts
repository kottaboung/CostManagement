import { Component, OnInit, Output } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ChartDetailComponent } from '../../modals/chart-detail/chart-detail.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Output() public page: string = 'dashboard';
  @Output() public selectedYear: number = 2024
  public currentYear: number = new Date().getFullYear();
  isLoading: boolean = false;

  years = [
    { year: 2023, label: '2023' },
    { year: 2024, label: '2024' }
  ];

  currentsIndex = 0;
  visibleCards = 3;

  public cards = [
    { title: 'Total Projects', description: 'Description 1' },
    { title: 'Current Year Cost', description:  'cost...'},
    { title: 'Totol Cost', description:  'cost...'},
    { title: 'Lastest Project', description:  'Project...'}
    
  ]

  get maxIndex(): number {
    return Math.max(this.cards.length - this.visibleCards);
  }

  slideLeft() {
    if (this.currentsIndex >= 0) {
      this.currentsIndex--;
      // this.visibleCards++;
    }
  }

  slideRight() {
    if (this.currentsIndex < this.maxIndex) {
      this.currentsIndex++;
      // this.visibleCards--;
    }
  }
  
  constructor(
    private loadingService: LoadingService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadingService.showLoading();
    setTimeout(() => {
      this.loadingService.hideLoading();
    }, 300);
  }

  onChartItemClicked(monthData: any): void {
    const dialogRef = this.dialog.open(ChartDetailComponent, { data: monthData });
    dialogRef.afterClosed().subscribe(() => {
      this.dialog.closeAll();
    });
  }
}
