import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { mockProjects } from '../../mockup-data';
import { LoadingService } from '../../../../shared/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ChartDetailComponent } from '../../modals/chart-detail/chart-detail.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  @Output() public page: string = 'dashbaord';
  currentIndex: number = 0;
  chartData: any;
  selectedYear: number = 2024;

  // @ViewChild('carouselInner') carouselInner!: ElementRef;
 
  // cardData: any[] = [
  //   { title: 'Card 1', description: 'Description for Card 1' },
  //   { title: 'Card 2', description: 'Description for Card 2' },
  //   { title: 'Card 3', description: 'Description for Card 3' },
  //   { title: 'Card 4', description: 'Description for Card 4' }
  // ];

  constructor(
    private loadingService: LoadingService,
    private dialog: MatDialog
  ){}

  ngOnInit() {
    this.updateChartData(this.selectedYear);
  }

  updateChartData(year: number) {
    this.loadingService.showLoading();
    setTimeout (() => {
      this.chartData = mockProjects.find(data => data.createdDate === new Date);
      this.loadingService.hideLoading();
      },300
    );
  }

  onChartItemClicked(monthData: any): void {
   this.dialog.open(ChartDetailComponent, {data: monthData})
  }

  changeYear(year: number) {
    this.selectedYear = year;
    this.updateChartData(year);
  }

  // prevSlide(): void {
  //   const items = this.carouselInner.nativeElement.children;
  //   const totalItems = items.length;
  //   this.currentIndex = (this.currentIndex - 1 + totalItems) % totalItems;
  //   this.updateCarousel();
  // }

  // nextSlide(): void {
  //   const items = this.carouselInner.nativeElement.children;
  //   const totalItems = items.length;
  //   this.currentIndex = (this.currentIndex + 1) % totalItems;
  //   this.updateCarousel();
  // }

  // updateCarousel(): void {
  //   const offset = -this.currentIndex * 100;
  //   this.carouselInner.nativeElement.style.transform = `translateX(${offset}%)`;
  // }

}
