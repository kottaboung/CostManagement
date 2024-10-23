import { Component, Input, OnInit } from '@angular/core';
import { ProjectDetail } from '../../../core/interface/chartResponse.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.component.html',
  styleUrl: './detail-modal.component.scss'
})
export class DetailModalComponent implements OnInit{
  @Input() monthName: string = '';
  @Input() monthDetail?: ProjectDetail[]

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
      console.log("detail :", this.monthDetail)
  }

  closeModal(): void {
    this.activeModal.dismiss('Cancel click');
  }

}
