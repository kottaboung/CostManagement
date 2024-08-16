import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingModalComponent } from '../modals/loading-modal/loading-modal.component';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private modalRef: any;

  constructor(
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  show(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.modalRef) {
        this.modalRef = this.modalService.open(LoadingModalComponent, {
          backdrop: 'static',
          keyboard: false,
          centered: true
        });
      }
    }
  }

  hide(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.modalRef) {
        this.modalRef.close();
        this.modalRef = null;
      }
    }
  }
}
