import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoadingModalComponent } from '../modals/loading-modal/loading-modal.component';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private modalRef: NgbModalRef | null = null;
  isLoading: boolean = false;
  
  constructor(
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  showLoading() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.modalRef) {
        this.modalRef = this.modalService.open(LoadingModalComponent, { backdrop: 'static', keyboard: false });
      }
    }
  }

  hideLoading() {
    if (isPlatformBrowser(this.platformId) && this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }
}
