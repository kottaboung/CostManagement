import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IconSvgComponent } from './components/icon-svg/icon-svg.component';
import { IconColorPipe } from './pipe/icon-color.pipe';
import { IconSizePipe } from './pipe/icon-size.pipe';
import { ChartComponent } from './components/chart/chart.component';
import { LoadingModalComponent } from './modals/loading-modal/loading-modal.component';
import { TableComponent } from './components/table/table.component';
import { CallendarComponent } from './components/callendar/callendar.component';
import { LoadingService } from './services/loading.service';
import { ProjectModalComponent } from './modals/project-modal/project-modal.component';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [
    IconSvgComponent,
    IconColorPipe,
    IconSizePipe,
    ChartComponent,
    LoadingModalComponent,
    TableComponent,
    CallendarComponent,
    ProjectModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgbModule,
    NgxDatatableModule,
    FullCalendarModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ],
  exports: [
    IconSvgComponent,
    IconSizePipe,
    IconColorPipe,
    ChartComponent,
    LoadingModalComponent,
    TableComponent,
    CallendarComponent,
    ProjectModalComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [
    LoadingService,
    ApiService,
    provideNgxMask()
  ]
})
export class SharedModule { }
